"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Bell, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "system",
    language: "fr",
    notifications: true,
    reminderTime: "09:00",
    weekStartDay: "monday",
  });

  const handleChange = (name: string, value: string | boolean) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSave = () => {
    // TODO: Sauvegarder les paramètres
    console.log("Settings saved:", settings);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Personnalisez votre expérience StayzUp
        </p>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Choisissez votre thème et vos préférences d&apos;affichage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Thème</Label>
              <Select
                id="theme"
                value={settings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="system">Système</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos rappels et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Activer les notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des rappels pour compléter vos habitudes
                </p>
              </div>
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) => handleChange("notifications", e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
            {settings.notifications && (
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Heure de rappel</Label>
                <input
                  type="time"
                  id="reminderTime"
                  value={settings.reminderTime}
                  onChange={(e) => handleChange("reminderTime", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Language & Region */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Langue et région
            </CardTitle>
            <CardDescription>
              Choisissez votre langue préférée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                id="language"
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekStartDay">Premier jour de la semaine</Label>
              <Select
                id="weekStartDay"
                value={settings.weekStartDay}
                onChange={(e) => handleChange("weekStartDay", e.target.value)}
              >
                <option value="monday">Lundi</option>
                <option value="sunday">Dimanche</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>
              Gérez les paramètres de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les paramètres de compte seront disponibles après la mise en place de l&apos;authentification.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}

