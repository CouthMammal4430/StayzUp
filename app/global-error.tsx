"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le débogage
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Erreur critique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Une erreur critique s&apos;est produite. Veuillez rafraîchir la page ou contacter le support.
              </p>
              {error.digest && (
                <p className="text-xs text-center text-muted-foreground">
                  Code d&apos;erreur: {error.digest}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button onClick={reset} variant="default">
                  Réessayer
                </Button>
                <Button onClick={() => window.location.href = "/"} variant="outline">
                  Retour à l&apos;accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}

