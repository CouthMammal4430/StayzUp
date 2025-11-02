import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/lib/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function unlockBadgesIfNeeded(userId: string) {
  const supabase = createClient();

  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (!stats) return [];

  const { data: owned } = await supabase
    .from("user_badges")
    .select("badge_id").eq("user_id", userId);
  const ownedIds = new Set((owned || []).map((b: any) => b.badge_id));

  const { data: badges } = await supabase.from("badges").select("*");
  const unlocks: any[] = [];
  for (const badge of badges || []) {
    if (ownedIds.has(badge.id)) continue;
    const ok = shouldUnlock(badge, stats);
    if (ok) unlocks.push({ user_id: userId, badge_id: badge.id });
  }
  if (unlocks.length > 0) {
    await supabase.from("user_badges").insert(unlocks);
  }
  return unlocks;
}

function shouldUnlock(badge: any, stats: any): boolean {
  switch (badge.condition_type) {
    case "task_completed":
      return stats.total_tasks_completed >= badge.condition_value;
    case "streak_days":
      return stats.longest_streak >= badge.condition_value;
    case "total_xp":
      return stats.total_xp >= badge.condition_value;
    case "level":
      return stats.current_level >= badge.condition_value;
    case "active_habits":
      // non-stocké : sautez pour l'instant
      return false;
    case "completion_rate":
      return false;
    default:
      return false;
  }
}

