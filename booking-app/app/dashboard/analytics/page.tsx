'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsChart } from '@/components/analytics-chart';
import { LoadingState } from '@/components/loading-state';
import { ErrorFallback } from '@/components/error-fallback';
import { apiClient } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EventAnalytics } from '@/lib/types';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  const [allAnalytics, setAllAnalytics] = useState<EventAnalytics[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real app, you'd fetch multiple event analytics
        // For now, we'll create mock data
        const mockAnalytics: EventAnalytics = {
          eventId: '1',
          eventTitle: 'Annual Tech Conference',
          totalTickets: 500,
          soldTickets: 350,
          totalRevenue: 8750,
          weeklyData: [
            { day: 'Mon', tickets: 45, revenue: 1125 },
            { day: 'Tue', tickets: 52, revenue: 1300 },
            { day: 'Wed', tickets: 48, revenue: 1200 },
            { day: 'Thu', tickets: 61, revenue: 1525 },
            { day: 'Fri', tickets: 73, revenue: 1825 },
            { day: 'Sat', tickets: 42, revenue: 1050 },
            { day: 'Sun', tickets: 58, revenue: 1450 },
          ],
        };

        setAnalytics(mockAnalytics);
        setAllAnalytics([mockAnalytics]);
        setSelectedEventId(mockAnalytics.eventId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
        console.error('[v0] Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = allAnalytics.find((a) => a.eventId === eventId);
    if (event) {
      setAnalytics(event);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track ticket sales and revenue for your events</p>
      </div>

      {error && (
        <ErrorFallback
          title="Failed to load analytics"
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {isLoading ? (
        <div className="space-y-6">
          <LoadingState count={2} type="chart" />
        </div>
      ) : (
        <>
          {/* Event Selector */}
          {allAnalytics.length > 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-sm">Select Event</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedEventId} onValueChange={handleEventChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allAnalytics.map((event) => (
                      <SelectItem key={event.eventId} value={event.eventId}>
                        {event.eventTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {analytics && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{analytics.totalTickets}</p>
                    <p className="text-xs text-muted-foreground mt-2">seats available</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tickets Sold
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{analytics.soldTickets}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round((analytics.soldTickets / analytics.totalTickets) * 100)}% sold
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">from ticket sales</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart
                  title="Sales Over Time"
                  description="Weekly ticket sales and revenue"
                  data={analytics.weeklyData}
                  type="line"
                />

                <AnalyticsChart
                  title="Revenue Distribution"
                  description="Weekly revenue breakdown"
                  data={analytics.weeklyData}
                  type="bar"
                />
              </div>

              {/* Additional Insights */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Performance metrics for your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Average Price per Ticket</p>
                      <p className="text-2xl font-bold">
                        ${analytics.totalRevenue > 0 && analytics.soldTickets > 0 ? (analytics.totalRevenue / analytics.soldTickets).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Remaining Tickets</p>
                      <p className="text-2xl font-bold">
                        {analytics.totalTickets - analytics.soldTickets}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-secondary rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {analytics.soldTickets < analytics.totalTickets * 0.5 ? 'Consider promoting your event to increase ticket sales' : 'Great job! Your event is gaining traction'}</li>
                      <li>• Monitor daily sales patterns to optimize marketing efforts</li>
                      <li>• Engage with attendees to build anticipation for the event</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
