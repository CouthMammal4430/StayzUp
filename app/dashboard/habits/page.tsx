"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HabitCard } from "@/components/habits/HabitCard";
import Link from "next/link";

// Données mock
const mockHabits = [
  {
    id: "1",
    user_id: "user_1",
    title: "Méditation matinale",
    description: "10 minutes de méditation chaque matin",
    icon: "🧘",
    color: "bg-purple-500",
    frequency: "daily" as const,
    xp_reward: 50,
    streak: 15,
    status: "active" as const,
    target_days_per_week: null,
    custom_schedule: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user_1",
    title: "Exercice physique",
    description: "30 minutes d'exercice",
    icon: "💪",
    color: "bg-red-500",
    frequency: "daily" as const,
    xp_reward: 75,
    streak: 12,
    status: "active" as const,
    target_days_per_week: null,
    custom_schedule: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user_1",
    title: "Lecture",
    description: "Lire 20 pages par jour",
    icon: "📚",
    color: "bg-blue-500",
    frequency: "daily" as const,
    xp_reward: 40,
    streak: 8,
    status: "active" as const,
    target_days_per_week: null,
    custom_schedule: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "user_1",
    title: "Écriture dans le journal",
    description: "Écrire dans mon journal intime",
    icon: "✍️",
    color: "bg-green-500",
    frequency: "daily" as const,
    xp_reward: 30,
    streak: 20,
    status: "active" as const,
    target_days_per_week: null,
    custom_schedule: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "user_1",
    title: "Apprendre une langue",
    description: "Pratiquer sur Duolingo",
    icon: "🌍",
    color: "bg-yellow-500",
    frequency: "daily" as const,
    xp_reward: 60,
    streak: 5,
    status: "active" as const,
    target_days_per_week: null,
    custom_schedule: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function HabitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");

  const filteredHabits = mockHabits.filter((habit) => {
    const matchesSearch = habit.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || habit.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mes Habitudes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez toutes vos habitudes
          </p>
        </div>
        <Link href="/dashboard/habits/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle habitude
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une habitude..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Toutes
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Actives
              </Button>
              <Button
                variant={filter === "paused" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("paused")}
              >
                En pause
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <HabitCard habit={habit} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Aucune habitude trouvée. Créez-en une nouvelle pour commencer !
            </p>
            <Link href="/dashboard/habits/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créer une habitude
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

