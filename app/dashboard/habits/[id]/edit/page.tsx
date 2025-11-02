"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Habit } from "@/types";

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "🎯",
    color: "#3b82f6",
    frequency: "daily" as "daily" | "weekly" | "custom",
    target_days_per_week: 5,
    custom_schedule: [] as string[],
    xp_reward: 10,
    streak_bonus_xp: 5,
    status: "active" as "active" | "paused" | "archived",
  });

  useEffect(() => {
    loadHabit();
  }, [habitId]);

  const loadHabit = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("id", habitId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          icon: data.icon || "🎯",
          color: data.color || "#3b82f6",
          frequency: data.frequency || "daily",
          target_days_per_week: data.target_days_per_week || 5,
          custom_schedule: data.custom_schedule || [],
          xp_reward: data.xp_reward || 10,
          streak_bonus_xp: data.streak_bonus_xp || 5,
          status: data.status || "active",
        });
      }
    } catch (error) {
      console.error("Error loading habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("habits")
        .update({
          title: formData.title,
          description: formData.description || null,
          icon: formData.icon,
          color: formData.color,
          frequency: formData.frequency,
          target_days_per_week: formData.frequency === "weekly" ? formData.target_days_per_week : null,
          custom_schedule: formData.frequency === "custom" ? formData.custom_schedule : null,
          xp_reward: formData.xp_reward,
          streak_bonus_xp: formData.streak_bonus_xp,
          status: formData.status,
        })
        .eq("id", habitId);

      if (error) throw error;

      router.push(`/dashboard/habits/${habitId}`);
    } catch (error) {
      console.error("Error updating habit:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/habits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Modifier l&apos;habitude</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label>Icône</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Ex: 🎯"
                />
              </div>
              <div className="w-32 space-y-2">
                <Label>Couleur</Label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fréquence</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(v: any) => setFormData({ ...formData, frequency: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="custom">Personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.frequency === "weekly" && (
                <div className="space-y-2">
                  <Label>Jours par semaine</Label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.target_days_per_week}
                    onChange={(e) =>
                      setFormData({ ...formData, target_days_per_week: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">En pause</SelectItem>
                    <SelectItem value="archived">Archivée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>XP de base</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.xp_reward}
                  onChange={(e) =>
                    setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 10 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Bonus streak XP</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.streak_bonus_xp}
                  onChange={(e) =>
                    setFormData({ ...formData, streak_bonus_xp: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href={`/dashboard/habits/${habitId}`}>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
