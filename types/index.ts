/**
 * Types principaux pour StayzUp
 */

// Types de tâches
export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  category: string | null;
  priority: TaskPriority;
  xp_reward: number;
  status: TaskStatus;
  tags: string[];
  reminder_enabled: boolean;
  reminder_time: string | null;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Types d'habitudes
export type HabitFrequency = "daily" | "weekly" | "custom";
export type HabitStatus = "active" | "paused" | "archived";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string;
  frequency: HabitFrequency;
  target_days_per_week: number | null;
  custom_schedule: string[] | null;
  xp_reward: number;
  streak_bonus_xp: number;
  status: HabitStatus;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

// Types pour les complétions
export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string;
  notes: string | null;
  xp_gained: number;
  created_at: string;
}

// Types pour la gamification
export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  current_rank: string;
  current_streak: number;
  longest_streak: number;
  total_tasks_completed: number;
  total_habits_completed: number;
  current_streak_start_date: string | null;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface XPHistory {
  id: string;
  user_id: string;
  xp_amount: number;
  source_type: "task" | "habit" | "quest" | "objective" | "streak_bonus" | "level_bonus";
  source_id: string | null;
  description: string | null;
  created_at: string;
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

// Types pour les badges
export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  condition_type: string;
  condition_value: number;
  xp_reward: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  badge?: Badge;
}

// Types pour les quêtes
export type QuestType = "weekly" | "monthly" | "special";
export type QuestTargetType = "tasks_count" | "habits_streak" | "xp_gain" | "custom";
export type QuestStatus = "active" | "completed" | "expired";

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  quest_type: QuestType;
  target_type: QuestTargetType;
  target_value: number;
  current_progress: number;
  xp_reward: number;
  status: QuestStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  completed_at: string | null;
}

// Types pour les objectifs personnels
export type ObjectiveType = "habit_frequency" | "task_count" | "streak_target" | "xp_target" | "custom";
export type ObjectiveStatus = "active" | "completed" | "failed";

export interface Objective {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  objective_type: ObjectiveType;
  target_value: number;
  current_progress: number;
  target_date: string | null;
  xp_reward: number;
  status: ObjectiveStatus;
  created_at: string;
  completed_at: string | null;
}

// Types pour les paramètres utilisateur
export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  language: string;
  notifications_enabled: boolean;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

