"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (error) {
      console.error("Error loading task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;
      router.push("/dashboard/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <p>Tâche non trouvée</p>
        <Link href="/dashboard/tasks">
          <Button>Retour aux tâches</Button>
        </Link>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500";
      case "high":
        return "bg-orange-500/10 text-orange-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/tasks/${taskId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl">{task.title}</CardTitle>
              <div className="flex items-center gap-3 mt-3">
                {task.priority && (
                  <span className={`text-sm px-3 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
                {task.category && (
                  <span className="text-sm text-muted-foreground">📁 {task.category}</span>
                )}
                {task.xp_reward > 0 && (
                  <span className="text-sm font-medium text-green-600">+{task.xp_reward} XP</span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {task.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {task.due_date && (
              <div>
                <h3 className="font-semibold mb-2">Date d&apos;échéance</h3>
                <p className="text-muted-foreground">
                  {new Date(task.due_date).toLocaleDateString("fr-FR")}
                  {task.due_time && ` à ${task.due_time}`}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Statut</h3>
              <p className="text-muted-foreground capitalize">{task.status}</p>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.completed_at && (
            <div>
              <h3 className="font-semibold mb-2">Complétée le</h3>
              <p className="text-muted-foreground">
                {new Date(task.completed_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

