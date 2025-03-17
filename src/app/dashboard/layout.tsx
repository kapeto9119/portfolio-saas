import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 transition-all duration-300 w-full">
        <DashboardHeader />
        <main className="container mx-auto py-6 px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
} 