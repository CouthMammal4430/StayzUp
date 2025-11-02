import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("Portal session - Non authentifié");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.log("Portal session - User ID:", user.id);

    // Récupérer l'ID client Stripe depuis la base de données
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    console.log("Portal session - Subscription:", subscription);
    console.log("Portal session - Error:", subError);

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Aucun abonnement trouvé. Veuillez contacter le support." },
        { status: 404 }
      );
    }

    console.log("Portal session - Creating for customer:", subscription.stripe_customer_id);

    // Créer une session Customer Portal
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://stayz-up.vercel.app"}/dashboard/settings`,
    });

    console.log("Portal session - URL:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erreur création portal session:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}
