"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar as CalendarIcon, Flame, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useDashboardStore } from "@/store/useDashboardStore";
import Link from "next/link";

export default function DashboardPage() {
  const { stats, habits, loading: storeLoading, loadAll } = useDashboardStore();
  const [user, setUser] = useState<any>(null);
  const [todayHabits, setTodayHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [xpToday, setXpToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState<Record<string, { completed: number; total: number }>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDayHabits, setSelectedDayHabits] = useState<{ name: string; xp: number; completed: boolean }[]>([]);
  const [loadingDayDetails, setLoadingDayDetails] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Vérifier si déjà chargé (désactive animation)
    const wasLoaded = sessionStorage.getItem("dashboard_loaded");
    if (wasLoaded) {
      setHasLoaded(true);
    }
    
    // Vérifier cache sessionStorage pour affichage immédiat
    const cachedTodayData = sessionStorage.getItem("dashboard_today");
    if (cachedTodayData) {
      const data = JSON.parse(cachedTodayData);
      setCompletedToday(data.completedToday);
      setXpToday(data.xpToday);
    }
    
    // Affichage immédiat si stats en cache
    if (stats) {
      setLoading(false);
    }
    
    // Charger toutes les données du store si pas déjà chargées
    if (!stats) {
      loadAll();
    }
    loadData();
    
    // Marquer comme chargé
    sessionStorage.setItem("dashboard_loaded", "true");
  }, []);

  useEffect(() => {
    loadMonthData();
  }, [currentMonth]);

  const loadData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser(authUser);

      // Utiliser les données du store si disponibles
      const storeHabits = get().habits;
      const activeHabits = storeHabits.length > 0 ? storeHabits : (await supabase
        .from("habits")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("status", "active")).data || [];

      setTodayHabits(activeHabits.length);

      // Complétions d'aujourd'hui
      const today = new Date().toISOString().split("T")[0];
      const { data: completions } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("completion_date", today);

      setCompletedToday(completions?.length || 0);

      // XP gagné aujourd'hui
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { data: xpHistory } = await supabase
        .from("xp_history")
        .select("xp_amount")
        .eq("user_id", authUser.id)
        .gte("created_at", startOfDay.toISOString());

      const totalXP = xpHistory?.reduce((sum, entry) => sum + entry.xp_amount, 0) || 0;
      setXpToday(totalXP);
      
      // Mettre en cache
      sessionStorage.setItem("dashboard_today", JSON.stringify({
        completedToday: completions?.length || 0,
        xpToday: totalXP
      }));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Habitudes actives
      const { data: habits } = await supabase
        .from("habits")
        .select("id")
        .eq("user_id", authUser.id)
        .eq("status", "active");

      const totalHabits = habits?.length || 0;

      // Complétions du mois
      const { data: completions } = await supabase
        .from("habit_completions")
        .select("completion_date")
        .eq("user_id", authUser.id)
        .gte("completion_date", firstDay.toISOString().split("T")[0])
        .lte("completion_date", lastDay.toISOString().split("T")[0]);

      const dayMap: Record<string, number> = {};
      completions?.forEach((c) => {
        dayMap[c.completion_date] = (dayMap[c.completion_date] || 0) + 1;
      });

      const data: Record<string, { completed: number; total: number }> = {};
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = new Date(year, month, d).toISOString().split("T")[0];
        data[dateStr] = {
          completed: dayMap[dateStr] || 0,
          total: totalHabits,
        };
      }

      setMonthData(data);
    } catch (error) {
      console.error("Error loading month data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const xpForCurrentLevel = stats ? Math.pow(stats.current_level - 1, 2) * 100 : 0;
  const xpForNextLevel = stats ? Math.pow(stats.current_level, 2) * 100 : 100;
  const xpInLevel = stats ? stats.total_xp - xpForCurrentLevel : 0;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 0;

  const progressPercentage = todayHabits > 0 ? Math.round((completedToday / todayHabits) * 100) : 0;

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Utilisateur";
  const userInitial = userName.charAt(0).toUpperCase();

  // Calcul du calendrier
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  const cells: (string | null)[] = Array(totalCells).fill(null);
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = new Date(year, month, d).toISOString().split("T")[0];
    cells[startOffset + d - 1] = dateStr;
  }

  const getCircleColor = (completed: number, total: number) => {
    if (total === 0) return "border-gray-300";
    const ratio = completed / total;
    if (ratio === 0) return "border-gray-300";
    if (ratio < 0.5) return "border-pink-300 bg-pink-50";
    if (ratio < 1) return "border-pink-500 bg-pink-100";
    return "border-purple-600 bg-purple-100";
  };

  const selectedDayData = selectedDay ? (monthData[selectedDay] || { completed: 0, total: 0 }) : null;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Carte de profil avec XP */}
      <motion.div 
        initial={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar 
                className={`h-16 w-16 ${user?.user_metadata?.avatar_frame || ""}`}
                style={{
                  backgroundColor: !user?.user_metadata?.avatar_url && user?.user_metadata?.avatar_color 
                    ? user.user_metadata.avatar_color 
                    : undefined
                }}
              >
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                ) : null}
                <AvatarFallback 
                  className="text-2xl font-bold text-white"
                  style={{
                    backgroundColor: user?.user_metadata?.avatar_color || "#8b5cf6"
                  }}
                >
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-pink-50 border border-pink-300 rounded-full text-xs font-medium text-pink-700">
                    {stats?.current_rank || "Débutant"}
                  </span>
                  <span className="px-3 py-1 bg-pink-50 border border-pink-300 rounded-full text-xs font-medium text-pink-700">
                    {stats?.total_xp || 0} XP
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Niveau {stats?.current_level || 1}</span>
                <span className="font-medium">
                  {Math.round(xpProgress)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {xpInLevel} / {xpNeeded} XP vers le niveau {(stats?.current_level || 1) + 1}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4 cartes de stats (2x2) */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: hasLoaded ? 0 : 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <Target className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{todayHabits}</p>
                <p className="text-xs text-muted-foreground">Habitudes aujourd'hui</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: hasLoaded ? 0 : 0.15 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-full border-4 border-green-500 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-green-500">{progressPercentage}%</span>
                </div>
                <p className="text-2xl font-bold">{completedToday}/{todayHabits}</p>
                <p className="text-xs text-muted-foreground">Progression</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: hasLoaded ? 0 : 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <Flame className="h-8 w-8 text-orange-500 mb-2" />
                <p className="text-2xl font-bold">
                  {stats?.current_streak || 0}
                </p>
                <p className="text-xs text-muted-foreground">Streak actuel</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: hasLoaded ? 0 : 0.25 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-green-600">+{xpToday}</p>
                <p className="text-xs text-muted-foreground">XP aujourd'hui</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Calendrier mensuel */}
      <motion.div 
        initial={hasLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: hasLoaded ? 0 : 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progression journalière</h3>
              <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
            </div>

            {/* Navigation mois */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                className="p-2 hover:bg-accent rounded"
              >
                ←
              </button>
              <h4 className="font-medium">
                {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </h4>
              <button
                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                className="p-2 hover:bg-accent rounded"
              >
                →
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground font-medium">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendrier */}
            <div className="grid grid-cols-7 gap-2">
              {cells.map((dateStr, i) => {
                if (!dateStr) {
                  return <div key={i} className="aspect-square" />;
                }

                const dayData = monthData[dateStr] || { completed: 0, total: 0 };
                const day = parseInt(dateStr.split("-")[2]);
                const ratio = dayData.total > 0 ? dayData.completed / dayData.total : 0;
                const isComplete = ratio === 1;

                let bgColor = "";
                let borderColor = "border-gray-300";
                let textColor = "text-foreground";

                if (dayData.total > 0) {
                  if (ratio === 0) {
                    borderColor = "border-gray-300";
                  } else if (ratio < 0.5) {
                    bgColor = "bg-pink-100";
                    borderColor = "border-pink-300";
                    textColor = "text-pink-700";
                  } else if (ratio < 1) {
                    bgColor = "bg-pink-200";
                    borderColor = "border-pink-500";
                    textColor = "text-pink-800";
                  } else {
                    bgColor = "bg-purple-200";
                    borderColor = "border-purple-600";
                    textColor = "text-purple-900";
                  }
                }

                return (
                  <button
                    key={dateStr}
                    onClick={async () => {
                      try {
                        setLoadingDayDetails(true);
                        
                        // Charger les habitudes de ce jour
                        const supabase = createClient();
                        const { data: { user: authUser } } = await supabase.auth.getUser();
                        if (!authUser) {
                          setLoadingDayDetails(false);
                          return;
                        }

                        const { data: allHabits, error: habitsError } = await supabase
                          .from("habits")
                          .select("id, title, xp_reward")
                          .eq("user_id", authUser.id)
                          .eq("status", "active");

                        if (habitsError) {
                          console.error("Erreur habitudes:", habitsError);
                          setLoadingDayDetails(false);
                          return;
                        }

                        const { data: dayCompletions, error: completionsError } = await supabase
                          .from("habit_completions")
                          .select("habit_id")
                          .eq("user_id", authUser.id)
                          .eq("completion_date", dateStr);

                        if (completionsError) {
                          console.error("Erreur completions:", completionsError);
                        }

                        const completedIds = new Set(dayCompletions?.map((c) => c.habit_id) || []);
                        const habitsWithStatus = (allHabits || []).map((h) => ({
                          name: h.title,
                          xp: h.xp_reward,
                          completed: completedIds.has(h.id),
                        }));
                        
                        setSelectedDayHabits(habitsWithStatus);
                        setSelectedDay(dateStr);
                      } catch (error) {
                        console.error("Erreur chargement habitudes jour:", error);
                        alert("Erreur lors du chargement des habitudes de ce jour");
                      } finally {
                        setLoadingDayDetails(false);
                      }
                    }}
                    className={`aspect-square rounded-full border-2 ${borderColor} ${bgColor} ${textColor} flex items-center justify-center text-sm font-medium relative hover:scale-110 transition-transform`}
                  >
                    {isComplete && (
                      <svg
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 h-4 w-4 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    )}
                    {day}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal détails jour */}
      {selectedDay && selectedDayData && !loadingDayDetails && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedDay(null);
            setSelectedDayHabits([]);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-lg p-6 max-w-sm w-full max-h-[80vh] flex flex-col"
          >
            <h3 className="font-bold text-lg mb-4">
              {new Date(selectedDay).toLocaleDateString("fr-FR", { 
                day: "numeric", 
                month: "long" 
              })}
            </h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Habitudes réussies</span>
                <span className="font-semibold">
                  {selectedDayData.completed} / {selectedDayData.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">XP total gagné</span>
                <span className="font-semibold text-green-600">
                  +{selectedDayHabits.filter((h) => h.completed).reduce((sum, h) => sum + h.xp, 0)} XP
                </span>
              </div>
            </div>

            {/* Liste des habitudes scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              <h4 className="font-semibold text-sm mb-2">Habitudes du jour</h4>
              {selectedDayHabits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune habitude ce jour-là
                </p>
              ) : (
                selectedDayHabits.map((habit, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      habit.completed 
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {habit.completed ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${habit.completed ? "text-green-700 dark:text-green-400" : "text-foreground"}`}>
                        {habit.name}
                      </span>
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ml-2 ${habit.completed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {habit.completed ? "+" : ""}{habit.xp} XP
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setSelectedDay(null);
                setSelectedDayHabits([]);
              }}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
