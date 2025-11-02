"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  LogOut, 
  User, 
  Bell,
  Palette,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/i18n/translations";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { stats, loadStats } = useDashboardStore();
  const { language, setLanguage } = useLanguageStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier cache sessionStorage
    const cachedUser = sessionStorage.getItem("user_data");
    const cachedSub = sessionStorage.getItem("subscription_data");
    
    if (cachedUser && cachedSub) {
      setUser(JSON.parse(cachedUser));
      setSubscription(JSON.parse(cachedSub));
      setLoading(false);
    }
    
    // Affichage immédiat si stats en cache
    if (stats) setLoading(false);
    else loadStats();
    
    // Toujours recharger en arrière-plan pour actualiser
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser(authUser);
      sessionStorage.setItem("user_data", JSON.stringify(authUser));

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (sub) {
        setSubscription(sub as any);
        sessionStorage.setItem("subscription_data", JSON.stringify(sub));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // Nettoyer le cache
      sessionStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Erreur API:", data.error);
        alert(`Erreur: ${data.error || "Impossible de charger le portail"}`);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur: URL du portail non disponible");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur s'est produite lors de l'ouverture du portail");
    }
  };

  const handleResetData = async () => {
    const confirmed = window.confirm(
      "⚠️ ATTENTION ⚠️\n\nVoulez-vous vraiment réinitialiser TOUTES vos données ?\n\n" +
      "Cela supprimera :\n" +
      "• Toutes vos habitudes\n" +
      "• Toutes vos complétions\n" +
      "• Tout votre XP et vos statistiques\n" +
      "• Votre historique complet\n\n" +
      "Cette action est IRRÉVERSIBLE !\n\n" +
      "Votre profil (nom, photo) et votre abonnement seront conservés."
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "Êtes-vous ABSOLUMENT sûr ?\n\n" +
      "Tapez OK pour confirmer la suppression définitive."
    );

    if (!doubleConfirm) return;

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Supprimer toutes les données de l'utilisateur
      await Promise.all([
        // Supprimer les complétions
        supabase.from("habit_completions").delete().eq("user_id", authUser.id),
        // Supprimer les habitudes
        supabase.from("habits").delete().eq("user_id", authUser.id),
        // Supprimer l'historique XP
        supabase.from("xp_history").delete().eq("user_id", authUser.id),
        // Réinitialiser les stats
        supabase.from("user_stats").delete().eq("user_id", authUser.id),
      ]);

      // Créer de nouvelles stats vierges
      await supabase.from("user_stats").insert({
        user_id: authUser.id,
        total_xp: 0,
        current_level: 1,
        current_rank: "Débutant",
        current_streak: 0,
        longest_streak: 0,
        total_habits_completed: 0,
        consistency_score: 0,
        perseverance_score: 0,
        diversification_score: 0,
        progression_score: 0,
        overall_score: 0,
      });

      // Nettoyer tous les caches
      sessionStorage.clear();
      
      alert("✅ Toutes vos données ont été réinitialisées avec succès !");
      
      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error("Erreur réinitialisation:", error);
      alert("❌ Erreur lors de la réinitialisation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      monthly: "Mensuel",
      yearly: "Annuel",
      lifetime: "Lifetime",
      trial: "Essai gratuit",
    };
    return names[plan] || plan;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>;
      case "trialing":
        return <Badge className="bg-blue-500">Essai</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="font-medium">
              {user?.user_metadata?.name || "Non défini"}
            </p>
          </div>
          <Link href="/dashboard/settings/profile">
            <Button variant="outline" className="w-full">
              Modifier le profil
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Abonnement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Abonnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Plan {getPlanName(subscription.plan)}</p>
                  {subscription.current_period_end && subscription.plan !== "lifetime" && (
                    <p className="text-xs text-muted-foreground">
                      {subscription.cancel_at_period_end
                        ? `Expire le ${new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}`
                        : `Renouvellement le ${new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}`}
                    </p>
                  )}
                  {subscription.plan === "lifetime" && (
                    <p className="text-xs text-muted-foreground">Accès à vie</p>
                  )}
                </div>
                {getStatusBadge(subscription.status)}
              </div>
              {subscription.plan !== "lifetime" && subscription.plan !== "trial" && (
                <Button onClick={handleManageSubscription} className="w-full" variant="outline">
                  Gérer mon abonnement
                </Button>
              )}
              {subscription.plan === "trial" && (
                <Link href="/pricing">
                  <Button className="w-full">Choisir un plan</Button>
                </Link>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">Aucun abonnement</p>
              <Link href="/pricing">
                <Button className="w-full">Voir les plans</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t("settings.appearance", language)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("settings.theme", language)}</p>
              <p className="text-xs text-muted-foreground">{t("settings.themeDesc", language)}</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("settings.language", language)}</p>
              <p className="text-xs text-muted-foreground">{t("settings.languageDesc", language)}</p>
            </div>
            <Select value={language} onValueChange={(val: "fr" | "en") => setLanguage(val)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gestion des notifications à venir...
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Zone dangereuse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">
              Réinitialiser toutes vos données (habitudes, XP, statistiques). Cette action est <span className="font-bold">irréversible</span>.
            </p>
            <Button 
              onClick={handleResetData} 
              variant="destructive" 
              className="w-full"
            >
              Réinitialiser mes données
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Déconnexion */}
      <Card>
        <CardContent className="p-4">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
