import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const STRIPE_PLANS = {
  monthly: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
    name: "Mensuel",
    price: 6.99,
    currency: "EUR",
    interval: "mois",
    features: [
      "Accès complet au dashboard",
      "Tâches et habitudes illimitées",
      "Système de gamification",
      "Statistiques avancées",
      "Synchronisation multi-appareils",
    ],
  },
  yearly: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
    name: "Annuel",
    price: 59.99,
    currency: "EUR",
    interval: "an",
    save: "14%",
    features: [
      "Tout du plan Mensuel",
      "2 mois offerts",
      "Support prioritaire",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
  },
  lifetime: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME!,
    name: "Lifetime",
    price: 149.99,
    currency: "EUR",
    interval: "à vie",
    popular: true,
    features: [
      "Tout du plan Annuel",
      "Accès à vie",
      "Toutes les futures fonctionnalités",
      "Support VIP",
      "Mises à jour gratuites à vie",
    ],
  },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;

