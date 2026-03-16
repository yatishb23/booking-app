// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  capacity: number;
  ticketsSold: number;
  price: number;
  organizer: string;
  organizerId: string;
}

export interface EventWithStats extends Event {
  totalRevenue: number;
  attendanceRate: number;
}

// Ticket types
export interface Ticket {
  id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  totalPrice: number;
  qrCode: string;
  purchasedAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Dashboard analytics
export interface EventAnalytics {
  eventId: string;
  eventTitle: string;
  totalTickets: number;
  soldTickets: number;
  totalRevenue: number;
  weeklyData: WeeklyDataPoint[];
}

export interface WeeklyDataPoint {
  day: string;
  tickets: number;
  revenue: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EventsListResponse {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
}
