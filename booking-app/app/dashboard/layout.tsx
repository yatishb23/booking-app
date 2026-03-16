import { DashboardSidebar } from '@/components/dashboard-sidebar';

export const metadata = {
  title: 'Dashboard - EventHub',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
