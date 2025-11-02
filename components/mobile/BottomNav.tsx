"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/i18n/translations";

export function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  
  const navItems = [
    { href: "/dashboard", label: t("nav.home", language), icon: Home },
    { href: "/dashboard/habits", label: t("nav.habits", language), icon: Calendar },
    { href: "/dashboard/stats", label: t("nav.stats", language), icon: BarChart3 },
    { href: "/dashboard/settings", label: t("nav.settings", language), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-background border-t md:hidden" style={{ position: 'fixed', bottom: 0 }}>
      <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            item.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

