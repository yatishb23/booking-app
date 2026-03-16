export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Events
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_ANALYTICS: (id: string) => `/events/${id}/analytics`,

  // Tickets
  TICKETS: '/tickets',
  BOOK_TICKET: '/tickets/book',
  VERIFY_TICKET: (qrCode: string) => `/tickets/verify/${qrCode}`,

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  MY_EVENTS: '/dashboard/my-events',

  // Upload
  UPLOAD: '/upload',
} as const;

export const EVENT_CATEGORIES = [
  'Technology',
  'Business',
  'Music',
  'Sports',
  'Arts',
  'Education',
  'Health',
  'Food',
  'Entertainment',
  'Networking',
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_DURATION = {
  EVENTS: 5 * 60 * 1000, // 5 minutes
  EVENT_DETAIL: 10 * 60 * 1000, // 10 minutes
  ANALYTICS: 15 * 60 * 1000, // 15 minutes
} as const;
