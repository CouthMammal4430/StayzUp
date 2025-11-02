"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthFixBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Auto-désactivation après le 10 novembre 2025
    const expirationDate = new Date("2025-11-10");
    if (new Date() > expirationDate) {
      return; // Ne plus afficher la bannière
    }

    // Vérifier si la bannière a déjà été fermée
    const wasDismissed = localStorage.getItem("auth-fix-banner-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Afficher après 2 secondes si l'utilisateur est sur la page
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("auth-fix-banner-dismissed", "true");
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-950 px-4 py-3 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-xl sm:text-2xl">⚠️</span>
            <div className="text-sm flex-1">
              <p className="font-semibold">Problème de connexion ?</p>
              <p className="text-xs hidden sm:block">Si vous ne pouvez pas vous connecter, cliquez ici.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/auth-fix" className="flex-1 sm:flex-none">
              <Button size="sm" variant="secondary" className="w-full sm:w-auto">
                Corriger
              </Button>
            </Link>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-yellow-600 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

