/**
 * Types principaux pour StayzUp
 */

// Types d'habitudes
export type HabitFrequency = "daily" | "weekly" | "custom";
export type HabitStatus = "active" | "paused" | "completed" | "archived";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string;
  frequency: HabitFrequency;
  status: HabitStatus;
  target_days_per_week: number | null;
  custom_schedule: string[] | null; // Pour le mode "custom"
  xp_reward: number; // XP gagné lors de la complétion
  created_at: string;
  updated_at: string;
}

// Types pour les complétions
export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes: string | null;
  xp_gained: number;
}

// Types pour la gamification
export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  total_habits_completed: number;
  current_streak_start_date: string | null;
  last_activity_date: string | null;
  updated_at: string;
}

export interface ScoreCategory {
  category: string;
  value: number;
  max_value: number;
  percentage: number;
}

export interface UserScores {
  consistency: number; // Cohérence dans les complétions
  perseverance: number; // Streaks
  diversification: number; // Variété des habitudes
  progression: number; // Évolution dans le temps
  overall: number; // Score global
}

// Types pour les abonnements
export type SubscriptionPlan = "monthly" | "quarterly" | "yearly" | "lifetime";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending";

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  started_at: string;
  expires_at: string | null; // null pour lifetime
  cancelled_at: string | null;
}

// Types pour les utilisateurs (étendu de Supabase)
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// Types pour les paramètres utilisateur
export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  language: "fr" | "en";
  notifications_enabled: boolean;
  reminder_time: string | null;
  week_start_day: "monday" | "sunday";
}

