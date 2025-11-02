import dynamic from "next/dynamic";
import { Navbar } from "@/components/dashboard/Navbar";

// Lazy load de la bottom nav pour améliorer les performances
const BottomNav = dynamic(
  () => import("@/components/mobile/BottomNav").then((mod) => ({ default: mod.BottomNav })),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar desktop/tablette uniquement */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
          {/* Contenu avec padding bottom sur mobile pour la bottom nav */}
          <main className="container mx-auto px-4 py-6 pb-24 md:pb-6 min-h-screen">
            {children}
          </main>
      
      {/* Bottom navigation mobile uniquement */}
      <BottomNav />
    </div>
  );
}

