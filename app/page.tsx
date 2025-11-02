"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Flame, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="StayzUp"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-bold">StayzUp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/clear-cache.html" target="_blank">
              <Button variant="ghost" size="sm" className="text-xs hidden md:inline-flex">
                🔧
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/signup">
              <Button>Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Développez vos habitudes
              <br />
              avec style
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              StayzUp transforme le développement personnel en jeu. Gagnez de l&apos;XP, 
              suivez vos streaks et voyez votre progression en temps réel.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              En savoir plus
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <TrendingUp className="h-8 w-8 text-primary" />,
              title: "Système d'XP",
              description: "Gagnez des points d'expérience à chaque habitude complétée et montez de niveau.",
            },
            {
              icon: <Flame className="h-8 w-8 text-streak" />,
              title: "Streaks",
              description: "Maintenez vos streaks et défiez-vous pour battre vos records personnels.",
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-level" />,
              title: "Statistiques",
              description: "Suivez votre progression avec des graphiques détaillés et des scores.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <Trophy className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl font-bold">Prêt à transformer vos habitudes ?</h2>
              <p className="text-lg text-muted-foreground">
                Rejoignez StayzUp et commencez votre parcours vers une meilleure version de vous-même.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Créer un compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="StayzUp"
                width={24}
                height={24}
              />
              <span className="font-semibold">StayzUp</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StayzUp. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
