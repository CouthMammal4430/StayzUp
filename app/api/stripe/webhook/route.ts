import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Configuration importante pour les webhooks Stripe
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  console.log("=== Webhook received ===");
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  
  console.log("Signature present:", !!signature);
  console.log("Webhook secret configured:", !!process.env.STRIPE_WEBHOOK_SECRET);

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Gérer les événements Stripe
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("=== Checkout completed ===");
  console.log("Session:", JSON.stringify(session, null, 2));
  
  const userId = session.metadata?.user_id;
  const planId = session.metadata?.plan_id;

  console.log("User ID:", userId);
  console.log("Plan ID:", planId);

  if (!userId || !planId) {
    console.error("Missing userId or planId in metadata");
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string | null;

  // Déterminer le plan
  const planMap: Record<string, string> = {
    monthly: "monthly",
    yearly: "yearly",
    lifetime: "lifetime",
  };
  const plan = planMap[planId] || "monthly";

  // Pour les paiements uniques (lifetime)
  if (session.mode === "payment") {
    console.log("Creating lifetime subscription...");
    const { error } = await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: null,
      stripe_price_id: session.metadata?.price_id || "",
      plan: "lifetime",
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: null,
    });
    if (error) {
      console.error("Error creating lifetime subscription:", error);
    } else {
      console.log("Lifetime subscription created successfully");
    }
  }
  // Pour les abonnements récurrents
  else if (subscriptionId) {
    console.log("Creating recurring subscription...");
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await updateSubscriptionInDb(userId, subscription, customerId, plan);
  } else {
    console.error("No subscription ID found for recurring payment");
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    // Retrouver l'utilisateur via le customer ID
    const { data } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscription.id)
      .single();

    if (!data) return;
    await updateSubscriptionInDb(data.user_id, subscription, subscription.customer as string);
  } else {
    await updateSubscriptionInDb(userId, subscription, subscription.customer as string);
  }
}

async function updateSubscriptionInDb(
  userId: string,
  subscription: Stripe.Subscription,
  customerId: string,
  planId?: string
) {
  const priceId = subscription.items.data[0].price.id;

  // Déterminer le plan selon le price_id
  let plan = planId;
  if (!plan) {
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY) plan = "monthly";
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY) plan = "yearly";
    else plan = "monthly";
  }

  const status =
    subscription.status === "active"
      ? "active"
      : subscription.status === "canceled"
      ? "cancelled"
      : subscription.status === "past_due"
      ? "past_due"
      : subscription.status === "trialing"
      ? "trialing"
      : "expired";

  await supabaseAdmin.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    plan,
    status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancelled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Le paiement a réussi, l'abonnement est déjà mis à jour via l'événement subscription
  console.log("Payment succeeded for invoice:", invoice.id);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Gérer l'échec de paiement
  const subscriptionId = invoice.subscription as string;
  if (subscriptionId) {
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("stripe_subscription_id", subscriptionId);
  }
}

