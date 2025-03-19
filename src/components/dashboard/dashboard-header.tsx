"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";

interface PageHeaderProps {
  heading: string;
  text?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  heading,
  text,
  icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          {icon && <div className="h-8 w-8">{icon}</div>}
          {heading}
        </h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function DashboardHeader() {
  const pathname = usePathname();
  
  // Determine page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/portfolio")) return "Portfolio";
    if (pathname.includes("/projects")) return "Projects";
    if (pathname.includes("/profile")) return "Profile";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
  };
  
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
} 