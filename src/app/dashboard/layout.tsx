import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-[280px] transition-all duration-300">
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 