"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Calendar, Target, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Données mock - sera remplacé par les vraies données
const mockHabit = {
  id: "1",
  title: "Méditation matinale",
  description: "10 minutes de méditation chaque matin pour commencer la journée sereinement",
  icon: "🧘",
  color: "bg-purple-500",
  frequency: "daily",
  xp_reward: 50,
  streak: 15,
  totalCompletions: 89,
  thisWeekCompletions: 6,
  weeklyTarget: 7,
};

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const completionRate = (mockHabit.thisWeekCompletions / mockHabit.weeklyTarget) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/habits">
          <Button variant="ghost" size="sm">
            ← Retour
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/habits/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Habit Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className={`h-20 w-20 rounded-xl ${mockHabit.color} flex items-center justify-center text-5xl`}>
                {mockHabit.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{mockHabit.title}</h1>
                <p className="text-muted-foreground mb-4">{mockHabit.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-streak/10 text-streak border-streak/20">
                    <Flame className="h-3 w-3 mr-1" />
                    {mockHabit.streak} jours
                  </Badge>
                  <Badge variant="secondary" className="bg-xp/10 text-xp border-xp/20">
                    <Zap className="h-3 w-3 mr-1" />
                    +{mockHabit.xp_reward} XP
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    Quotidienne
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Complétions totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockHabit.totalCompletions}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">
                  {mockHabit.thisWeekCompletions}/{mockHabit.weeklyTarget}
                </p>
                <Progress value={completionRate} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                XP total gagné
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-xp">
                {(mockHabit.totalCompletions * mockHabit.xp_reward).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Calendar Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Calendrier des complétions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              Le calendrier des complétions sera disponible prochainement.
              Vous pourrez voir vos jours complétés sur un calendrier visuel.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

