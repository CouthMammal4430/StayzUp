"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const icons = [
  "🧘", "💪", "📚", "✍️", "🌍", "💧", "🥗", "😴",
  "🎵", "🎨", "📱", "🚶", "🏃", "🧹", "🍎", "☕",
];

const colors = [
  { name: "Violet", value: "bg-purple-500" },
  { name: "Rouge", value: "bg-red-500" },
  { name: "Bleu", value: "bg-blue-500" },
  { name: "Vert", value: "bg-green-500" },
  { name: "Jaune", value: "bg-yellow-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Rose", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
];

export default function NewHabitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "📝",
    color: "bg-blue-500",
    frequency: "daily",
    targetDays: 7,
    xpReward: 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Sauvegarder l'habitude
    console.log("New habit:", formData);
    router.push("/dashboard/habits");
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nouvelle Habitude</h1>
          <p className="text-muted-foreground mt-1">
            Créez une nouvelle habitude à suivre
          </p>
        </div>
        <Link href="/dashboard/habits">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Donnez un nom et une description à votre habitude
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                placeholder="Ex: Méditation matinale"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Ex: 10 minutes de méditation chaque matin"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="grid grid-cols-8 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleChange("icon", icon)}
                    className={`
                      h-12 w-12 rounded-lg text-2xl flex items-center justify-center
                      transition-all hover:scale-110
                      ${formData.icon === icon ? "ring-2 ring-primary ring-offset-2" : "hover:bg-accent"}
                    `}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange("color", color.value)}
                    className={`
                      h-12 w-12 rounded-lg ${color.value}
                      transition-all hover:scale-110
                      ${formData.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""}
                    `}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence *</Label>
              <Select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => handleChange("frequency", e.target.value)}
                required
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="custom">Personnalisée</option>
              </Select>
            </div>

            {/* Target Days */}
            {formData.frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="targetDays">Jours cibles par semaine</Label>
                <Input
                  id="targetDays"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.targetDays}
                  onChange={(e) => handleChange("targetDays", parseInt(e.target.value))}
                />
              </div>
            )}

            {/* XP Reward */}
            <div className="space-y-2">
              <Label htmlFor="xpReward">Récompense XP</Label>
              <Input
                id="xpReward"
                type="number"
                min="10"
                max="200"
                value={formData.xpReward}
                onChange={(e) => handleChange("xpReward", parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                XP gagné lorsque vous complétez cette habitude
              </p>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Aperçu</Label>
              <Card className="border-2 border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-14 w-14 rounded-xl ${formData.color} flex items-center justify-center text-3xl`}
                    >
                      {formData.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {formData.title || "Titre de l&apos;habitude"}
                      </h3>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground">
                          {formData.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        +{formData.xpReward} XP
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href="/dashboard/habits">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Créer l&apos;habitude
          </Button>
        </div>
      </form>
    </div>
  );
}

