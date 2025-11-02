"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DebugAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleClearAll = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    localStorage.clear();
    await fetch("/api/auth/clear", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Debug Authentification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">État de l&apos;authentification</h3>
              {user ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800">✅ Connecté</p>
                  <p className="text-sm text-green-600 mt-1">Email: {user.email}</p>
                  <p className="text-sm text-green-600">ID: {user.id}</p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800">❌ Non connecté</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button onClick={handleClearAll} variant="destructive" className="w-full">
                🧹 Nettoyer TOUT (Auth + Cache + Cookies)
              </Button>
              
              <Link href="/logout" className="block">
                <Button variant="outline" className="w-full">
                  🚪 Déconnexion normale
                </Button>
              </Link>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  🔑 Aller à la connexion
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button variant="ghost" className="w-full">
                  🏠 Retour accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ℹ️ Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Si tu es bloqué en boucle :</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Clique sur &quot;Nettoyer TOUT&quot;</li>
              <li>Tu seras redirigé vers l&apos;accueil</li>
              <li>Clique sur &quot;Connexion&quot; pour te reconnecter</li>
            </ol>
            <p className="mt-4">
              <strong>Si ça ne marche toujours pas :</strong>
            </p>
            <p>Utilise la navigation privée ou vide manuellement les cookies du site.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

