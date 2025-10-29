"use client";

import { TrendingUp, Target, Layers, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  color: string;
}

export function ScoreCard({ title, value, maxValue, icon, color }: ScoreCardProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("p-2 rounded-md", color)}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">/ {maxValue}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScoresGrid({ scores }: { scores: { category: string; value: number; maxValue: number; icon: React.ReactNode; color: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {scores.map((score) => (
        <ScoreCard key={score.category} {...score} />
      ))}
    </div>
  );
}

