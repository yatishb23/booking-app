'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventList } from '@/components/event-list';
import { LoadingState } from '@/components/loading-state';
import { ErrorFallback } from '@/components/error-fallback';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { BarChart3, Plus, TrendingUp, Wallet } from 'lucide-react';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<{ totalEvents: number; totalRevenue: number; totalTickets: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsData = await apiClient.getDashboardStats();
        setStats(statsData);

        // Fetch user's events
        const eventsData = await apiClient.getEvents(1, 6);
        setEvents(eventsData.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('[v0] Error fetching dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your event management overview.</p>
      </div>

      {error && (
        <ErrorFallback
          title="Failed to load dashboard"
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />
            ))}
          </div>
          <LoadingState count={3} />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalEvents}</p>
                  <p className="text-xs text-muted-foreground mt-2">Active events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">From ticket sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalTickets}</p>
                  <p className="text-xs text-muted-foreground mt-2">Sold</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Events</CardTitle>
                  <CardDescription>Manage and track your hosted events</CardDescription>
                </div>
                <Link href="/dashboard/create-event">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No events yet</p>
                  <Link href="/dashboard/create-event">
                    <Button>Create Your First Event</Button>
                  </Link>
                </div>
              ) : (
                <EventList events={events} variant="compact" />
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create an Event</CardTitle>
                <CardDescription>Set up a new event and start selling tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/create-event">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">View Analytics</CardTitle>
                <CardDescription>Track ticket sales and revenue insights</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/analytics">
                  <Button className="w-full">View Reports</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
