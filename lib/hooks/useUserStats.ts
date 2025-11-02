import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserStats } from "@/types";

// Hook réutilisable pour les stats utilisateur avec cache
export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("user_stats");
    if (cached) {
      setStats(JSON.parse(cached));
      setLoading(false);
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setStats(data);
        sessionStorage.setItem("user_stats", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    sessionStorage.removeItem("user_stats");
    loadStats();
  };

  return { stats, loading, refreshStats };
}

