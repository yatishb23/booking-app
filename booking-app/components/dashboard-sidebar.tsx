'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Plus, BarChart3, LogOut } from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/create-event',
      label: 'Create Event',
      icon: Plus,
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 border-r bg-background h-screen overflow-y-auto sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">EventHub</h1>
        <p className="text-sm text-muted-foreground">Dashboard</p>
      </div>

      <nav className="space-y-2 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);

          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start"
              >
                <Icon className="w-4 h-4 mr-2" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </aside>
  );
}
