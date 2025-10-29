"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  size = "md",
}: StreakDisplayProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const isHighStreak = currentStreak >= 7;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-streak/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isHighStreak ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className={cn("text-streak", isHighStreak ? "h-6 w-6 fill-streak" : "h-5 w-5")} />
            </motion.div>
            <div>
              <p className={cn("font-semibold text-foreground", sizeClasses[size])}>
                Streak actuel
              </p>
              <p className={cn("text-muted-foreground", sizeClasses[size])}>
                Meilleur: {longestStreak} jours
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "bg-streak/10 text-streak border-streak/20 text-lg px-3 py-1",
              isHighStreak && "animate-pulse"
            )}
          >
            {currentStreak} 🔥
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

