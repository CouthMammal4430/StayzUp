"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useDashboardStore } from "@/store/useDashboardStore";
import { TrendingUp, Target } from "lucide-react";

export default function StatsPage() {
  const { stats, loadStats } = useDashboardStore();
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const [xpData, setXpData] = useState<{ date: string; xp: number }[]>([]);
  const [habitsData, setHabitsData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier cache des graphiques
    const cacheKey = `stats-graphs-${period}`;
    const cachedGraphs = sessionStorage.getItem(cacheKey);
    
    if (cachedGraphs) {
      const { xp, habits } = JSON.parse(cachedGraphs);
      setXpData(xp);
      setHabitsData(habits);
      setLoading(false);
    }
    
    // Affichage immédiat si stats en cache
    if (stats) setLoading(false);
    else loadStats();
    
    // Charger les données (mettra à jour le cache)
    loadStatsData();
  }, [period]);

  const loadStatsData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      const from = startDate.toISOString().split("T")[0];

      // XP par jour
      const { data: xp } = await supabase
        .from("xp_history")
        .select("created_at, xp_amount")
        .eq("user_id", user.id)
        .gte("created_at", from);

      const xpMap: Record<string, number> = {};
      xp?.forEach((e) => {
        const d = e.created_at.split("T")[0];
        xpMap[d] = (xpMap[d] || 0) + e.xp_amount;
      });

      const xpSeries: { date: string; xp: number }[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = d.toISOString().split("T")[0];
        xpSeries.push({ date: key, xp: xpMap[key] || 0 });
      }
      setXpData(xpSeries);

      // Habitudes complétées par jour
      const { data: completions } = await supabase
        .from("habit_completions")
        .select("completion_date")
        .eq("user_id", user.id)
        .gte("completion_date", from);

      const habitsMap: Record<string, number> = {};
      completions?.forEach((c) => {
        habitsMap[c.completion_date] = (habitsMap[c.completion_date] || 0) + 1;
      });

      const habitsSeries: { date: string; count: number }[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = d.toISOString().split("T")[0];
        habitsSeries.push({ date: key, count: habitsMap[key] || 0 });
      }
      setHabitsData(habitsSeries);
      
      // Mettre en cache les graphiques
      const cacheKey = `stats-graphs-${period}`;
      sessionStorage.setItem(cacheKey, JSON.stringify({
        xp: xpSeries,
        habits: habitsSeries
      }));
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxXP = Math.max(10, ...xpData.map((d) => d.xp));
  const maxHabits = Math.max(5, ...habitsData.map((d) => d.count));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
            <SelectItem value="90">90 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* XP gagné */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            XP gagné
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 items-end h-40">
            {xpData.map((point) => (
              <div
                key={point.date}
                className="flex-1 bg-gradient-to-t from-primary to-purple-600 rounded-t min-h-[2px] relative group"
                style={{ height: `${(point.xp / maxXP) * 100}%` }}
              >
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {point.date.split("-")[2]}/{point.date.split("-")[1]}: {point.xp} XP
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Total: {xpData.reduce((sum, d) => sum + d.xp, 0)} XP
          </div>
        </CardContent>
      </Card>

      {/* Habitudes complétées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            Habitudes complétées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 items-end h-40">
            {habitsData.map((point) => (
              <div
                key={point.date}
                className="flex-1 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t min-h-[2px] relative group"
                style={{ height: `${(point.count / maxHabits) * 100}%` }}
              >
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {point.date.split("-")[2]}/{point.date.split("-")[1]}: {point.count} habitudes
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Total: {habitsData.reduce((sum, d) => sum + d.count, 0)} habitudes
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
