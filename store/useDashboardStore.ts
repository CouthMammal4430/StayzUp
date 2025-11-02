import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { UserStats, Habit, Task } from "@/types";

interface DashboardState {
  // Data
  stats: UserStats | null;
  habits: Habit[];
  tasks: Task[];
  completions: Record<string, Set<string>>; // date -> Set<habit_id>
  
  // Loading states
  loading: boolean;
  
  // Actions
  setStats: (stats: UserStats | null) => void;
  setHabits: (habits: Habit[]) => void;
  setTasks: (tasks: Task[]) => void;
  setCompletions: (completions: Record<string, Set<string>>) => void;
  
  // Load functions
  loadStats: () => Promise<void>;
  loadHabits: () => Promise<void>;
  loadTasks: () => Promise<void>;
  loadCompletions: (days?: number) => Promise<void>;
  loadAll: () => Promise<void>;
  
  // Update functions
  toggleHabit: (habitId: string, date: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  addXP: (amount: number, source: string, sourceId?: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  habits: [],
  tasks: [],
  completions: {},
  loading: false,

  setStats: (stats) => set({ stats }),
  setHabits: (habits) => set({ habits }),
  setTasks: (tasks) => set({ tasks }),
  setCompletions: (completions) => set({ completions }),

  loadStats: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      set({ stats: data });
    } else {
      // Créer les stats si elles n'existent pas
      const { data: newStats } = await supabase
        .from("user_stats")
        .insert({
          user_id: user.id,
          total_xp: 0,
          current_level: 1,
          current_rank: "Débutant",
        })
        .select()
        .single();
      if (newStats) set({ stats: newStats });
    }
  },

  loadHabits: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    set({ habits: data || [] });
  },

  loadTasks: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["todo", "in_progress"])
      .order("priority", { ascending: false })
      .limit(50);

    set({ tasks: data || [] });
  },

  loadCompletions: async (days = 30) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    const from = startDate.toISOString().split("T")[0];

    const { data } = await supabase
      .from("habit_completions")
      .select("habit_id, completion_date")
      .eq("user_id", user.id)
      .gte("completion_date", from);

    const map: Record<string, Set<string>> = {};
    data?.forEach((c) => {
      if (!map[c.completion_date]) {
        map[c.completion_date] = new Set();
      }
      map[c.completion_date].add(c.habit_id);
    });

    set({ completions: map });
  },

  loadAll: async () => {
    set({ loading: true });
    await Promise.all([
      get().loadStats(),
      get().loadHabits(),
      get().loadTasks(),
      get().loadCompletions(),
    ]);
    set({ loading: false });
  },

  toggleHabit: async (habitId: string, date: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { completions, habits } = get();
    const isCompleted = completions[date]?.has(habitId);

    if (isCompleted) {
      // Supprimer la complétion
      await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", user.id)
        .eq("completion_date", date);

      // Mettre à jour le state
      const newCompletions = { ...completions };
      newCompletions[date]?.delete(habitId);
      set({ completions: newCompletions });
    } else {
      // Ajouter la complétion
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      await supabase.from("habit_completions").insert({
        habit_id: habitId,
        user_id: user.id,
        completion_date: date,
        xp_gained: habit.xp_reward,
      });

      // Ajouter XP
      await get().addXP(habit.xp_reward, "habit", habitId);

      // Mettre à jour le state
      const newCompletions = { ...completions };
      if (!newCompletions[date]) {
        newCompletions[date] = new Set();
      }
      newCompletions[date].add(habitId);
      set({ completions: newCompletions });
    }
  },

  completeTask: async (taskId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { tasks } = get();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    // Ajouter XP
    await get().addXP(task.xp_reward, "task", taskId);

    // Retirer de la liste
    set({ tasks: tasks.filter((t) => t.id !== taskId) });
  },

  addXP: async (amount: number, source: string, sourceId?: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { stats } = get();
    if (!stats) return;

    // Enregistrer dans l'historique
    await supabase.from("xp_history").insert({
      user_id: user.id,
      xp_amount: amount,
      source_type: source,
      source_id: sourceId,
    });

    // Calculer nouveau niveau
    const newTotalXP = stats.total_xp + amount;
    const newLevel = Math.floor(Math.sqrt(newTotalXP / 100)) + 1;
    const ranks = ["Débutant", "Motivé", "Discipliné", "Expert", "Maître", "Légende", "Immortel"];
    const newRank =
      newLevel < 5 ? ranks[0] :
      newLevel < 10 ? ranks[1] :
      newLevel < 20 ? ranks[2] :
      newLevel < 35 ? ranks[3] :
      newLevel < 50 ? ranks[4] :
      newLevel < 75 ? ranks[5] : ranks[6];

    // Mettre à jour en base
    await supabase.from("user_stats").update({
      total_xp: newTotalXP,
      current_level: newLevel,
      current_rank: newRank,
      total_tasks_completed: source === "task" ? stats.total_tasks_completed + 1 : stats.total_tasks_completed,
      total_habits_completed: source === "habit" ? stats.total_habits_completed + 1 : stats.total_habits_completed,
    }).eq("user_id", user.id);

    // Mettre à jour le state
    set({
      stats: {
        ...stats,
        total_xp: newTotalXP,
        current_level: newLevel,
        current_rank: newRank,
        total_tasks_completed: source === "task" ? stats.total_tasks_completed + 1 : stats.total_tasks_completed,
        total_habits_completed: source === "habit" ? stats.total_habits_completed + 1 : stats.total_habits_completed,
      },
    });

    // Nettoyer le cache session
    sessionStorage.removeItem("user_stats");
  },
}));

