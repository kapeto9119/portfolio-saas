"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, Settings, User, Briefcase, 
  FileText, LayoutDashboard, LogOut,
  Menu, X, GraduationCap, BookOpen
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
  isCollapsed: boolean;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close mobile sidebar when path changes
  const pathname = usePathname();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);
  
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      // We'll let the client-side navigation handle the redirect
      toast.success("Logged out successfully");
      // The session provider will handle updating the UI
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
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center">
              <span className="text-lg font-semibold">Portfolio Builder</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            <SidebarItem
              href="/dashboard"
              icon={LayoutDashboard}
              title="Dashboard"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/portfolio"
              icon={Briefcase}
              title="Portfolio"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/portfolio-management"
              icon={FileText}
              title="Portfolio Management"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/projects"
              icon={FileText}
              title="Projects"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/experience"
              icon={BookOpen}
              title="Experience"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/education"
              icon={GraduationCap}
              title="Education"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/profile"
              icon={User}
              title="Profile"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/settings"
              icon={Settings}
              title="Settings"
              isCollapsed={isCollapsed}
            />
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && <ThemeToggle />}
            {!isCollapsed && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
            {isCollapsed && (
              <div className="flex flex-col gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ href, icon: Icon, title, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
} 