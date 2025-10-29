"use client";

import { motion } from "framer-motion";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoresGrid } from "@/components/gamification/ScoreCard";

const mockStats = {
  totalXP: 12450,
  currentLevel: 8,
  totalCompletions: 342,
  activeHabits: 5,
  currentStreak: 15,
  longestStreak: 28,
};

const mockWeeklyData = [
  { day: "Lun", completions: 4, xp: 280 },
  { day: "Mar", completions: 5, xp: 350 },
  { day: "Mer", completions: 4, xp: 300 },
  { day: "Jeu", completions: 6, xp: 420 },
  { day: "Ven", completions: 5, xp: 360 },
  { day: "Sam", completions: 3, xp: 240 },
  { day: "Dim", completions: 4, xp: 280 },
];

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
    value: 78,
    maxValue: 100,
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    color: "bg-green-500/10",
  },
  {
    category: "Diversification",
    value: 65,
    maxValue: 100,
    icon: <Award className="h-5 w-5 text-purple-500" />,
    color: "bg-purple-500/10",
  },
  {
    category: "Progression",
    value: 92,
    maxValue: 100,
    icon: <Calendar className="h-5 w-5 text-orange-500" />,
    color: "bg-orange-500/10",
  },
];

export default function StatsPage() {
  const overallScore = Math.round(
    mockScores.reduce((acc, s) => acc + s.value, 0) / mockScores.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Suivez votre progression et vos performances
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "XP Total", value: mockStats.totalXP.toLocaleString(), icon: <TrendingUp className="h-5 w-5 text-xp" /> },
          { label: "Niveau", value: mockStats.currentLevel, icon: <Award className="h-5 w-5 text-level" /> },
          { label: "Complétions", value: mockStats.totalCompletions, icon: <Target className="h-5 w-5 text-green-500" /> },
          { label: "Streak", value: `${mockStats.currentStreak} 🔥`, icon: <Calendar className="h-5 w-5 text-streak" /> },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="text-muted-foreground">{stat.icon}</div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vos Scores</CardTitle>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Score Global</p>
                <p className="text-3xl font-bold text-primary">{overallScore}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScoresGrid scores={mockScores} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Activité de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWeeklyData.map((day, index) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        {day.completions} complétions
                      </span>
                      <span className="font-semibold text-xp">
                        +{day.xp} XP
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.completions / 6) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="bg-primary h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Prochaines Réalisations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Streak de 30 jours", progress: 50, icon: "🔥" },
                { title: "Niveau 10", progress: 80, icon: "⭐" },
                { title: "100 complétions", progress: 66, icon: "🎯" },
              ].map((achievement, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <p className="font-medium">{achievement.title}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.progress}% complété
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

