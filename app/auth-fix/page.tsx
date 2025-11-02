"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthFixPage() {
  const router = useRouter();

  useEffect(() => {
    const fixAuth = async () => {
      try {
        // Nettoyer complètement
        const supabase = createClient();
        await supabase.auth.signOut();
        
        sessionStorage.clear();
        localStorage.clear();
        
        await fetch("/api/auth/clear", { method: "POST" });
        
        // Attendre un peu pour que tout soit nettoyé
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Rediriger vers la page d'accueil
        window.location.href = "/";
      } catch (error) {
        console.error("Fix error:", error);
        window.location.href = "/";
      }
    };
    
    fixAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center max-w-md p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold mb-3">Mise à jour en cours...</h1>
        <p className="text-muted-foreground mb-2">
          Nous mettons à jour votre expérience StayzUp
        </p>
        <p className="text-sm text-muted-foreground">
          Vous serez redirigé automatiquement dans quelques secondes
        </p>
      </div>
    </div>
  );
}

