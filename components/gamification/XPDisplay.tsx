"use client";

import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface XPDisplayProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
  xpForCurrentLevel: number;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

export function XPDisplay({
  currentXP,
  level,
  xpForNextLevel,
  xpForCurrentLevel,
  animated = false,
  size = "md",
}: XPDisplayProps) {
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progress = (xpInCurrentLevel / xpNeededForNext) * 100;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-xp/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={animated ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Star className="h-5 w-5 text-xp fill-xp" />
            </motion.div>
            <div>
              <p className={cn("font-semibold text-xp", sizeClasses[size])}>
                Niveau {level}
              </p>
              <p className={cn("text-muted-foreground", sizeClasses[size])}>
                {xpInCurrentLevel.toLocaleString()} / {xpNeededForNext.toLocaleString()} XP
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-xp/10 text-xp border-xp/20">
            <Zap className="h-3 w-3 mr-1" />
            {currentXP.toLocaleString()} XP
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}

