import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <p className="text-lg text-muted-foreground mt-2">
            Page non trouvée
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Désolé, la page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                Aller au Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

