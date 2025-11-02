"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, MoreVertical, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useDashboardStore } from "@/store/useDashboardStore";

export default function HabitsPage() {
  const { habits, completions, loading, loadHabits, loadCompletions, toggleHabit } = useDashboardStore();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [slideDirection, setSlideDirection] = useState(0);

  useEffect(() => {
    // Charger depuis le store si vide
    if (habits.length === 0) {
      loadHabits();
    }
    if (Object.keys(completions).length === 0) {
      loadCompletions(30);
    }
  }, []);


  const getWeekDates = () => {
    const dates: string[] = [];
    const today = new Date(currentWeek);
    const dayOfWeek = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const handleToggleHabit = async (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    await toggleHabit(habitId, today);
  };

  const goToPreviousWeek = () => {
    setSlideDirection(-1);
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToNextWeek = () => {
    setSlideDirection(1);
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const weekDates = getWeekDates();
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Date du jour */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h2>
      </div>

      {/* Timeline 7 jours */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={goToPreviousWeek}
              className="p-1 hover:bg-accent rounded-md transition-colors"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 text-center text-sm font-medium text-muted-foreground">
              {new Date(weekDates[0]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              {" - "}
              {new Date(weekDates[6]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </div>
            <button
              onClick={goToNextWeek}
              className="p-1 hover:bg-accent rounded-md transition-colors"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentWeek.toISOString()}
              initial={{ x: slideDirection * 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection * -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex justify-between gap-0.5"
            >
            {weekDates.map((dateStr) => {
              const date = new Date(dateStr);
              const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2).toUpperCase();
              const dayNum = date.getDate();
              const completedCount = completions[dateStr]?.size || 0;
              const totalCount = habits.length;
              const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              const isToday = dateStr === today;

              return (
                <button
                  key={dateStr}
                  onClick={() => setCurrentWeek(new Date(dateStr))}
                  className="flex-1 flex flex-col items-center gap-1 hover:bg-accent rounded-lg p-1 transition-colors"
                >
                  <span className="text-xs text-muted-foreground font-medium">{dayName}</span>
                  <div className={`relative ${isToday ? "scale-110" : ""}`}>
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - percentage / 100)}`}
                        className={
                          percentage === 100
                            ? "text-purple-600"
                            : percentage >= 50
                            ? "text-pink-500"
                            : percentage > 0
                            ? "text-pink-300"
                            : "text-gray-300"
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                      {dayNum}
                    </span>
                  </div>
                </button>
              );
            })}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Bouton nouvelle habitude */}
      <div className="pt-2">
        <Link href="/dashboard/habits/new">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <Plus className="h-5 w-5" />
                <span>Nouvelle habitude</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Liste des habitudes */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Aucune habitude active</p>
              <Link href="/dashboard/habits/new">
                <Button className="mt-4">Créer une habitude</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit) => {
            const isCompletedToday = completions[today]?.has(habit.id);

            return (
              <Card key={habit.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Icône/Emoji */}
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          backgroundColor: habit.color + "20",
                          color: habit.color,
                        }}
                      >
                        {habit.icon || "🎯"}
                      </div>

                      {/* Infos habitude */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{habit.title}</h3>
                          {habit.current_streak > 0 && (
                            <span className="text-xs font-medium text-orange-600 flex items-center gap-0.5">
                              {habit.current_streak} <Flame className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isCompletedToday ? (
                            <span className="text-green-600 font-medium">+{habit.xp_reward} XP</span>
                          ) : (
                            `${habit.xp_reward} XP`
                          )}
                        </p>
                      </div>

                      {/* Bouton check */}
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`h-10 w-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isCompletedToday
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {isCompletedToday && <Check className="h-5 w-5" />}
                      </button>

                      {/* Bouton menu */}
                      <Link href={`/dashboard/habits/${habit.id}/edit`}>
                        <button className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center flex-shrink-0">
                          <MoreVertical className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
