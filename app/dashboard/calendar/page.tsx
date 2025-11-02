"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Calendar as CalendarIcon } from "lucide-react";

interface DayData { date: string; tasks: number; habits: number }

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [days, setDays] = useState<DayData[]>([]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.toISOString().slice(0,7)]);

  const load = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const year = current.getFullYear();
    const month = current.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const from = first.toISOString().slice(0,10);
    const to = last.toISOString().slice(0,10);

    const { data: tasks } = await supabase
      .from("tasks")
      .select("completed_at, due_date")
      .eq("user_id", user.id)
      .gte("created_at", from)
      .lte("created_at", to);

    const { data: comps } = await supabase
      .from("habit_completions")
      .select("completion_date")
      .eq("user_id", user.id)
      .gte("completion_date", from)
      .lte("completion_date", to);

    const map: Record<string, DayData> = {};
    for (let d = 1; d <= last.getDate(); d++) {
      const key = new Date(year, month, d).toISOString().slice(0,10);
      map[key] = { date: key, tasks: 0, habits: 0 };
    }

    (tasks || []).forEach((t: any) => {
      const key = (t.completed_at || t.due_date || '').slice(0,10);
      if (map[key]) map[key].tasks += 1;
    });
    (comps || []).forEach((c: any) => {
      const key = c.completion_date;
      if (map[key]) map[key].habits += 1;
    });
    setDays(Object.values(map));
  };

  const weeks = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Lundi=0
    const total = ((startOffset + days.length) <= 35 ? 35 : 42);
    const cells: (DayData | null)[] = Array(total).fill(null);
    days.forEach((d, i) => { cells[startOffset + i] = d; });
    const chunks: (DayData | null)[][] = [];
    for (let i=0;i<cells.length;i+=7) chunks.push(cells.slice(i, i+7));
    return chunks;
  }, [days, current]);

  const monthLabel = current.toLocaleString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> {monthLabel}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth()-1, 1))}>Mois -</button>
              <button className="px-3 py-1 border rounded" onClick={() => setCurrent(new Date())}>Aujourd'hui</button>
              <button className="px-3 py-1 border rounded" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth()+1, 1))}>Mois +</button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 text-center text-sm text-muted-foreground mb-2">
            {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d) => (<div key={d}>{d}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="contents">
                {week.map((cell, ci) => (
                  <div key={ci} className={`min-h-[80px] rounded border p-1 text-xs ${cell ? '' : 'bg-muted'}`}>
                    {cell && (
                      <>
                        <div className="font-medium">{parseInt(cell.date.slice(8,10))}</div>
                        <div className="mt-1 flex flex-col gap-1">
                          {cell.tasks > 0 && <div className="text-blue-600">📌 {cell.tasks} tâches</div>}
                          {cell.habits > 0 && <div className="text-green-600">🔥 {cell.habits} habitudes</div>}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
