"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, CheckCircle2, Edit, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Habit } from "@/types";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit & { icon?: string; streak?: number; completed?: boolean };
}

export function HabitCard({ habit }: HabitCardProps) {
  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implémenter la complétion
    console.log("Complete habit:", habit.id);
  };

  return (
    <Link href={`/dashboard/habits/${habit.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-14 w-14 rounded-xl flex items-center justify-center text-3xl",
                    habit.color || "bg-primary"
                  )}
                >
                  {habit.icon || "📝"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {habit.description}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2 border-t">
              <Badge variant="secondary" className="bg-streak/10 text-streak border-streak/20">
                <Flame className="h-3 w-3 mr-1" />
                {habit.streak || 0} jours
              </Badge>
              <Badge variant="secondary" className="bg-xp/10 text-xp border-xp/20">
                +{habit.xp_reward} XP
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant={habit.completed ? "secondary" : "default"}
                className="flex-1"
                onClick={handleComplete}
              >
                {habit.completed ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complété
                  </>
                ) : (
                  "Marquer comme fait"
                )}
              </Button>
              <Link href={`/dashboard/habits/${habit.id}/edit`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

