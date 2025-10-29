import { create } from "zustand";
import { type Habit } from "@/types";

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [],
  isLoading: false,
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) =>
    set((state) => ({ habits: [...state.habits, habit] })),
  updateHabit: (id, updatedHabit) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...updatedHabit } : h
      ),
    })),
  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

