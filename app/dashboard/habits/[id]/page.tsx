"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Habit, UserStats } from "@/types";
import { XPAnimation } from "@/components/gamification/XPAnimation";
import { unlockBadgesIfNeeded } from "@/lib/utils";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.id as string;
  const [habit, setHabit] = useState<Habit | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [xpAnimation, setXpAnimation] = useState<{
    show: boolean;
    xp: number;
    levelUp?: boolean;
    newLevel?: number;
    newRank?: string;
  } | null>(null);

  useEffect(() => {
    load();
  }, [habitId]);

  const load = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: h } = await supabase
        .from("habits")
        .select("*")
        .eq("id", habitId)
        .eq("user_id", user.id)
        .single();

      const { data: s } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (h) setHabit(h as any);
      if (s) setStats(s as any);
    } finally {
      setLoading(false);
    }
  };

  const markTodayDone = async () => {
    if (!habit || marking) return;
    setMarking(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const yyyyMmDd = today.toISOString().slice(0, 10);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yyyyMmDdYesterday = yesterday.toISOString().slice(0, 10);

      // éviter double marquage
      const { data: existing } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", habit.id)
        .eq("user_id", user.id)
        .eq("completion_date", yyyyMmDd)
        .maybeSingle();
      if (existing) return;

      // insert completion
      await supabase.from("habit_completions").insert({
        habit_id: habit.id,
        user_id: user.id,
        completion_date: yyyyMmDd,
        xp_gained: habit.xp_reward,
      });

      // vérifier streak (si hier complété -> +1, sinon =1)
      const { data: yesterdayCompletion } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", habit.id)
        .eq("user_id", user.id)
        .eq("completion_date", yyyyMmDdYesterday)
        .maybeSingle();

      const newStreak = (yesterdayCompletion ? habit.current_streak + 1 : 1);
      const newLongest = Math.max(newStreak, habit.longest_streak);

      await supabase
        .from("habits")
        .update({ current_streak: newStreak, longest_streak: newLongest })
        .eq("id", habit.id);

      // add XP (avec bonus streak si streak palier)
      const baseXP = habit.xp_reward;
      const bonus = newStreak % 7 === 0 ? habit.streak_bonus_xp : 0;
      const totalAdd = baseXP + bonus;

      await supabase.from("xp_history").insert({
        user_id: user.id,
        xp_amount: totalAdd,
        source_type: "habit",
        source_id: habit.id,
        description: bonus > 0 ? `Habitude + bonus streak ${bonus}` : `Habitude`
      });

      if (stats) {
        const newTotal = stats.total_xp + totalAdd;
        const newLevel = Math.floor(Math.sqrt(newTotal / 100)) + 1;
        const ranks = ["Débutant","Motivé","Discipliné","Expert","Maître","Légende","Immortel"];
        const newRank = newLevel < 5 ? ranks[0] : newLevel < 10 ? ranks[1] : newLevel < 20 ? ranks[2] : newLevel < 35 ? ranks[3] : newLevel < 50 ? ranks[4] : newLevel < 75 ? ranks[5] : ranks[6];
        await supabase
          .from("user_stats")
          .update({ total_xp: newTotal, current_level: newLevel, current_rank: newRank, total_habits_completed: stats.total_habits_completed + 1, current_streak: Math.max(stats.current_streak, newStreak), longest_streak: Math.max(stats.longest_streak, newLongest) })
          .eq("user_id", user.id);

        // Mettre à jour les stats locales
        const updatedStats = {
          ...stats,
          total_xp: newTotal,
          current_level: newLevel,
          current_rank: newRank,
          total_habits_completed: stats.total_habits_completed + 1,
          current_streak: Math.max(stats.current_streak, newStreak),
          longest_streak: Math.max(stats.longest_streak, newLongest),
        };
        setStats(updatedStats);
        await unlockBadgesIfNeeded(user.id);

        // Déclencher l'animation
        const levelUp = newLevel > stats.current_level;
        setXpAnimation({
          show: true,
          xp: totalAdd,
          levelUp,
          newLevel: levelUp ? newLevel : undefined,
          newRank: levelUp ? newRank : undefined,
        });
      }

      await load();
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <p>Habitude introuvable</p>
        <Link href="/dashboard/habits"><Button>Retour</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Animation XP */}
      {xpAnimation && xpAnimation.show && stats && (
        <XPAnimation
          xp={xpAnimation.xp}
          totalXP={stats.total_xp}
          currentLevel={stats.current_level}
          currentRank={stats.current_rank}
          onComplete={() => setXpAnimation(null)}
        />
      )}

      <div className="flex items-center gap-4">
        <Link href="/dashboard/habits">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-3xl font-bold">{habit.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {habit.description && <p className="text-muted-foreground">{habit.description}</p>}
          <p className="text-sm">Streak actuel: <b>{habit.current_streak}</b> — Meilleur: <b>{habit.longest_streak}</b></p>
          <p className="text-sm">XP: <b>{habit.xp_reward}</b> — Bonus streak: <b>{habit.streak_bonus_xp}</b></p>
          <div className="flex gap-2">
            <Button onClick={markTodayDone} disabled={marking}>Marquer comme fait aujourd&apos;hui</Button>
            <Link href={`/dashboard/habits/${habit.id}/edit`}><Button variant="outline">Modifier</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

