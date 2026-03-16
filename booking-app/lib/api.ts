import { API_BASE_URL, API_ENDPOINTS } from './constants';
import type { ApiResponse, Event, EventsListResponse, Ticket, EventAnalytics } from './types';
import { MOCK_EVENTS } from './mock-data';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    // Determine if we should use mock data (e.g., if fetch fails or for specific endpoints)
    // For this demo, we'll try to fetch, and if it fails (likely due to no backend), return mock data.
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Simulate network delay for realism if using fetch
      // await new Promise(resolve => setTimeout(resolve, 500)); 

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
         // If connection refused (backend down) or 404, throw to catch block to use mock
         throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
       console.log(`[v0] API Request failed, using Mock Data for ${endpoint}`);
       return this.getMockData(endpoint, options) as Promise<T>;
    }
  }

  // Mock Data Handler
  private async getMockData(endpoint: string, options?: RequestInit): Promise<any> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Handle Event Detail
      if (endpoint.includes('/events/') && !endpoint.includes('/events?')) {
           const matches = endpoint.match(/\/events\/([^\/?]+)/);
           if (matches && matches[1]) {
               const eventId = matches[1];
               const event = MOCK_EVENTS.find(e => e.id === eventId);
               if (event) return event;
           }
      }

      // Handle Events List
      if (endpoint.includes(API_ENDPOINTS.EVENTS)) {
          // Check for URLSearchParams in endpoint string
          const queryString = endpoint.split('?')[1];
          const urlParams = new URLSearchParams(queryString || '');
          const category = urlParams.get('category');
          
          let filteredEvents = MOCK_EVENTS;
          if (category && category !== 'All') {
              filteredEvents = MOCK_EVENTS.filter(e => e.category === category);
          }
          
          return {
              events: filteredEvents,
              total: filteredEvents.length,
              page: 1,
              totalPages: 1
          };
      }
      
      // Default fallback
      return {};
  }

  // Events endpoints
  async getEvents(page: number = 1, pageSize: number = 12, category?: string) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(category && { category }),
    });
    return this.request<EventsListResponse>(
      `${API_ENDPOINTS.EVENTS}?${params.toString()}`
    );
  }

  async getEventById(id: string) {
    return this.request<Event>(API_ENDPOINTS.EVENT_DETAIL(id));
  }

  async createEvent(eventData: Omit<Event, 'id' | 'ticketsSold'>) {
    return this.request<Event>(API_ENDPOINTS.EVENTS, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: Partial<Event>) {
    return this.request<Event>(API_ENDPOINTS.EVENT_DETAIL(id), {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.request<void>(API_ENDPOINTS.EVENT_DETAIL(id), {
      method: 'DELETE',
    });
  }

  // Tickets endpoints
  async bookTicket(ticketData: Omit<Ticket, 'id' | 'qrCode' | 'purchasedAt'>) {
    return this.request<Ticket>(API_ENDPOINTS.BOOK_TICKET, {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async getTickets(eventId?: string) {
    const params = new URLSearchParams(eventId ? { eventId } : {});
    return this.request<Ticket[]>(
      `${API_ENDPOINTS.TICKETS}?${params.toString()}`
    );
  }

  async verifyTicket(qrCode: string) {
    return this.request<Ticket>(API_ENDPOINTS.VERIFY_TICKET(qrCode));
  }

  // Analytics endpoints
  async getEventAnalytics(id: string) {
    return this.request<EventAnalytics>(API_ENDPOINTS.EVENT_ANALYTICS(id));
  }

  async getDashboardStats() {
    return this.request<{
      totalEvents: number;
      totalRevenue: number;
      totalTickets: number;
    }>(API_ENDPOINTS.DASHBOARD_STATS);
  }

  // Upload endpoint
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<{ url: string }>(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
