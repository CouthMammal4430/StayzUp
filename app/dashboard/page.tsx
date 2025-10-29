"use client";

import { motion } from "framer-motion";
import { XPDisplay } from "@/components/gamification/XPDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { ScoresGrid } from "@/components/gamification/ScoreCard";
import { TrendingUp, Target, Layers, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Données mock - seront remplacées par les vraies données plus tard
const mockStats = {
  currentXP: 2450,
  level: 5,
  xpForNextLevel: 3000,
  xpForCurrentLevel: 2000,
  currentStreak: 12,
  longestStreak: 25,
};

const mockScores = [
  {
    category: "Cohérence",
    value: 85,
    maxValue: 100,
    icon: <Target className="h-5 w-5 text-blue-500" />,
    color: "bg-blue-500/10",
  },
  {
    category: "Persévérance",
    value: 72,
    maxValue: 100,
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    color: "bg-green-500/10",
  },
  {
    category: "Diversification",
    value: 68,
    maxValue: 100,
    icon: <Layers className="h-5 w-5 text-purple-500" />,
    color: "bg-purple-500/10",
  },
  {
    category: "Progression",
    value: 90,
    maxValue: 100,
    icon: <Activity className="h-5 w-5 text-orange-500" />,
    color: "bg-orange-500/10",
  },
];

const mockHabits = [
  {
    id: "1",
    title: "Méditation matinale",
    icon: "🧘",
    color: "bg-purple-500",
    completed: true,
    streak: 5,
  },
  {
    id: "2",
    title: "Exercice physique",
    icon: "💪",
    color: "bg-red-500",
    completed: false,
    streak: 12,
  },
  {
    id: "3",
    title: "Lecture",
    icon: "📚",
    color: "bg-blue-500",
    completed: true,
    streak: 8,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bonjour ! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Prêt à progresser aujourd&apos;hui ?
          </p>
        </div>
        <Link href="/dashboard/habits/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle habitude
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <XPDisplay
            currentXP={mockStats.currentXP}
            level={mockStats.level}
            xpForNextLevel={mockStats.xpForNextLevel}
            xpForCurrentLevel={mockStats.xpForCurrentLevel}
            animated={true}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StreakDisplay
            currentStreak={mockStats.currentStreak}
            longestStreak={mockStats.longestStreak}
          />
        </motion.div>
      </div>

      {/* Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Vos Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoresGrid scores={mockScores} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Habitudes d&apos;aujourd&apos;hui</CardTitle>
            <Link href="/dashboard/habits">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg ${habit.color} flex items-center justify-center text-2xl`}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{habit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Streak: {habit.streak} jours 🔥
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={habit.completed ? "secondary" : "default"}
                    size="sm"
                  >
                    {habit.completed ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complété
                      </>
                    ) : (
                      "Marquer"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

