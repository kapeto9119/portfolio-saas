"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Settings, User, Briefcase, 
  FileText, LayoutDashboard, LogOut,
  Menu, X, GraduationCap, BookOpen,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close mobile sidebar when path changes
  const pathname = usePathname();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);
  
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };
  
  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileSidebar}
        className="fixed top-4 right-4 z-50 md:hidden"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-[280px] flex-col border-r bg-card shadow-sm",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Portfolio Builder</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col gap-2 px-3">
            <SidebarItem
              href="/dashboard"
              icon={LayoutDashboard}
              title="Dashboard"
            />
            <SidebarItem
              href="/dashboard/portfolio"
              icon={Briefcase}
              title="Portfolio"
            />
            <SidebarItem
              href="/dashboard/projects"
              icon={FileText}
              title="Projects"
            />
            <SidebarItem
              href="/dashboard/portfolio/ai-enhancer"
              icon={Sparkles}
              title="AI Features"
            />
            <SidebarItem
              href="/dashboard/experience"
              icon={BookOpen}
              title="Experience"
            />
            <SidebarItem
              href="/dashboard/education"
              icon={GraduationCap}
              title="Education"
            />
            <SidebarItem
              href="/dashboard/profile"
              icon={User}
              title="Profile"
            />
            <SidebarItem
              href="/dashboard/settings"
              icon={Settings}
              title="Settings"
            />
          </nav>
        </div>
        
        <div className="border-t p-4 bg-muted/10">
          <div className="flex items-center justify-between gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ href, icon: Icon, title }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative group",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        "w-full",
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "" : "group-hover:text-foreground")} />
      <span className="truncate">{title}</span>
      {isActive && (
        <span className="absolute right-2 h-2 w-2 rounded-full bg-primary-foreground/20" />
      )}
    </Link>
  );
} 