import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { priceId, userId, planId } = await request.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Vérifier l'utilisateur
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur a déjà un customer Stripe ou un abonnement
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, id")
      .eq("user_id", userId)
      .single();

    let customerId = existingSub?.stripe_customer_id;
    const hasHadSubscription = !!existingSub?.id; // A déjà eu un abonnement

    // Créer un customer Stripe si nécessaire
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: userId,
        },
      });
      customerId = customer.id;
    }

    // Déterminer le mode selon le plan
    const mode = planId === "lifetime" ? "payment" : "subscription";

    // Trial de 7 jours uniquement pour le plan mensuel, pour les nouveaux utilisateurs
    const hasTrialPeriod = !hasHadSubscription && planId === "monthly";

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://stayz-up.vercel.app"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://stayz-up.vercel.app"}/pricing`,
      metadata: {
        user_id: userId,
        plan_id: planId,
        price_id: priceId,
      },
      subscription_data: mode === "subscription" ? {
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
        trial_period_days: hasTrialPeriod ? 7 : undefined,
      } : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

