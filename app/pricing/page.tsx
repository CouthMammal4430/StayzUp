"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    id: "monthly",
    name: "Mensuel",
    price: 6.99,
    currency: "€",
    interval: "mois",
    trial: "7 jours gratuits",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_1SOftCQtcnMXTC8QwfA4omCH",
    features: [
      "7 jours d'essai gratuit",
      "Accès complet au dashboard",
      "Tâches et habitudes illimitées",
      "Système de gamification",
      "Statistiques avancées",
      "Synchronisation multi-appareils",
    ],
  },
  {
    id: "yearly",
    name: "Annuel",
    price: 59.99,
    currency: "€",
    interval: "an",
    save: "14% d'économie",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "price_1SOfuDQtcnMXTC8Qxx4Vja4o",
    features: [
      "Tout du plan Mensuel",
      "2 mois offerts",
      "Support prioritaire",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 149.99,
    currency: "€",
    interval: "à vie",
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || "price_1SOfvjQtcnMXTC8Q3sCAfxdJ",
    features: [
      "Tout du plan Annuel",
      "Accès à vie - Paiement unique",
      "Toutes les futures fonctionnalités",
      "Support VIP",
      "Mises à jour gratuites à vie",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planId: string) => {
    setLoading(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/pricing");
        return;
      }

      // Créer une session Stripe Checkout
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          planId,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        setLoading(null);
        return;
      }

      // Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de la création de la session");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation simple */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="StayzUp"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-bold">StayzUp</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/logout">
              <Button variant="ghost" size="sm">Déconnexion</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Commencez à développer vos habitudes avec StayzUp
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  {(plan as any).trial && (
                    <div className="text-sm text-green-600 font-medium mt-2">
                      🎁 {(plan as any).trial}
                    </div>
                  )}
                  {plan.save && (
                    <div className="text-sm text-green-600 font-medium mt-2">
                      {plan.save}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="text-5xl font-bold">{plan.price}{plan.currency}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.priceId, plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                        Chargement...
                      </>
                    ) : (
                      <>
                        Choisir {plan.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Tous les plans incluent une garantie satisfait ou remboursé de 30 jours
          </p>
        </div>
      </section>
    </div>
  );
}

