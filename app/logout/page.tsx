"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        
        // Nettoyer tout le cache
        sessionStorage.clear();
        localStorage.clear();
        
        // Nettoyer les cookies côté serveur
        await fetch("/api/auth/clear", { method: "POST" });
        
        // Forcer un rechargement complet pour nettoyer tous les états
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout error:", error);
        window.location.href = "/login";
      }
    };
    
    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Déconnexion en cours...</p>
      </div>
    </div>
  );
}

