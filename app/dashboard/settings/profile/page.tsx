"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const AVATAR_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

const AVATAR_FRAMES = [
  "none",
  "ring-2 ring-primary",
  "ring-4 ring-gradient-to-r from-primary to-purple-600",
  "ring-4 ring-yellow-500",
  "ring-4 ring-pink-500",
  "ring-4 ring-green-500",
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [avatarType, setAvatarType] = useState<"initial" | "url">("initial");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFrame, setAvatarFrame] = useState("none");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser(authUser);
      setName(authUser.user_metadata?.name || "");
      setAvatarUrl(authUser.user_metadata?.avatar_url || "");
      setAvatarColor(authUser.user_metadata?.avatar_color || AVATAR_COLORS[0]);
      setAvatarFrame(authUser.user_metadata?.avatar_frame || "none");
      setAvatarType(authUser.user_metadata?.avatar_url ? "url" : "initial");
    } catch (error) {
      console.error("Erreur chargement utilisateur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();

      // Mettre à jour le profil
      const updates: any = {
        data: {
          name,
          avatar_color: avatarColor,
          avatar_frame: avatarFrame,
        },
      };

      if (avatarType === "url" && avatarUrl) {
        updates.data.avatar_url = avatarUrl;
      } else {
        updates.data.avatar_url = "";
      }

      const { error: updateError } = await supabase.auth.updateUser(updates);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      // Mettre à jour le mot de passe si fourni
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          setSaving(false);
          return;
        }

        if (newPassword.length < 8) {
          setError("Le mot de passe doit contenir au moins 8 caractères");
          setSaving(false);
          return;
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) {
          setError(passwordError.message);
          setSaving(false);
          return;
        }
      }

      // Nettoyer les caches pour forcer le rafraîchissement
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("dashboard_today");
      sessionStorage.removeItem("dashboard_loaded");

      router.push("/dashboard/settings");
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      setError("Une erreur s'est produite");
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

  const userInitial = name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Modifier le profil</h1>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Aperçu Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aperçu</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Avatar className={`h-24 w-24 ${avatarFrame !== "none" ? avatarFrame : ""}`}>
            {avatarType === "url" && avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : null}
            <AvatarFallback
              className="text-3xl font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photo de profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={avatarType === "initial" ? "default" : "outline"}
              onClick={() => setAvatarType("initial")}
              className="flex-1"
            >
              Initiale colorée
            </Button>
            <Button
              variant={avatarType === "url" ? "default" : "outline"}
              onClick={() => setAvatarType("url")}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              URL Image
            </Button>
          </div>

          {avatarType === "initial" ? (
            <div className="space-y-3">
              <Label>Couleur de fond</Label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    className={`h-12 rounded-lg border-2 ${
                      avatarColor === color ? "border-primary ring-2 ring-primary" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>URL de l&apos;image</Label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Entrez l&apos;URL d&apos;une image ou utilisez un service comme Imgur
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cadre avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cadre de profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_FRAMES.map((frame, idx) => (
              <button
                key={frame}
                onClick={() => setAvatarFrame(frame)}
                className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                  avatarFrame === frame ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
              >
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 ${frame !== "none" ? frame : ""}`} />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {avatarFrame === "none" ? "Aucun cadre" : `Cadre ${AVATAR_FRAMES.indexOf(avatarFrame)}`}
          </p>
        </CardContent>
      </Card>

      {/* Mot de passe (si connexion par email) */}
      {user?.app_metadata?.provider === "email" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changer le mot de passe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le mot de passe</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez le mot de passe"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/settings" className="flex-1">
          <Button variant="outline" className="w-full">
            Annuler
          </Button>
        </Link>
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}

