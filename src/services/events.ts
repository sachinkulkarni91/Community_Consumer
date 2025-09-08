import axios from 'axios';
import { getApiUrl } from '../utils/api-url';

export interface Event {
  id: string;
  title: string;
  description: string;
  community: {
    id: string;
    name: string;
    profilePhoto: string;
  };
  organizer: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string;
  };
  startDateTime: string;
  endDateTime: string;
  platform: 'Zoom' | 'Teams' | 'Google Meet' | 'In-Person' | 'zoom' | 'teams' | 'google-meet' | 'in-person';
  meetingLink?: string;
  location?: string;
  maxAttendees?: number;
  attendees?: Array<{
    user: {
      id: string;
      name: string;
      username: string;
      profilePhoto: string;
    };
    enrolledAt: string;
    status: 'enrolled' | 'attended' | 'no-show';
  }>;
  category: 'Workshop' | 'Webinar' | 'Training' | 'Meeting' | 'Social' | 'Other' | string;
  tags: string[];
  image?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isPast?: boolean;
  isUpcoming?: boolean;
  isLive?: boolean;
  attendeeCount?: number;
  availableSpots?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  community: string;
  startDateTime: string;
  endDateTime: string;
  platform: string;
  meetingLink?: string;
  location?: string;
  maxAttendees?: number;
  category?: string;
  tags?: string[];
  image?: string;
}

// Get all events
export const getEvents = async (params?: {
  community?: string;
  status?: string;
  timeFilter?: 'upcoming' | 'past' | 'live';
  limit?: number;
  page?: number;
}): Promise<Event[]> => {
  const queryParams = new URLSearchParams();
  if (params?.community) queryParams.append('community', params.community);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.timeFilter) queryParams.append('timeFilter', params.timeFilter);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const response = await axios.get(getApiUrl(`/api/events/?${queryParams.toString()}`));
  
  // Handle different response formats
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data && Array.isArray(response.data.events)) {
    return response.data.events;
  } else if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  return response.data;
};

// Get single event
export const getEvent = async (id: string): Promise<Event> => {
  const response = await axios.get(getApiUrl(`/api/events/all`));
  return response.data;
};



// Enroll in event
export const enrollInEvent = async (id: string): Promise<{ message: string; event: Event }> => {
  const response = await axios.post(getApiUrl(`/api/events/${id}/enroll`));
  return response.data;
};

// Unenroll from event
export const unenrollFromEvent = async (id: string): Promise<{ message: string; event: Event }> => {
  const response = await axios.delete(getApiUrl(`/api/events/${id}/enroll`));
  return response.data;
};

// Get user's enrolled events
export const getMyEnrolledEvents = async (timeFilter?: 'upcoming' | 'past'): Promise<Event[]> => {
  const queryParams = new URLSearchParams();
  if (timeFilter) queryParams.append('timeFilter', timeFilter);
  
  const response = await axios.get(getApiUrl(`/api/events/my/enrolled?${queryParams.toString()}`));
  
  // Handle different response formats
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data && Array.isArray(response.data.events)) {
    return response.data.events;
  } else if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  return response.data;
};

// Upload event image (admin only)
export const uploadEventImage = async (imageFile: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(getApiUrl('/api/events/upload-image'), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get all events (admin only)
export const getAllEvents = async (params?: {
  limit?: number;
  page?: number;
}): Promise<Event[]> => {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const response = await axios.get(getApiUrl(`/api/events/all?${queryParams.toString()}`));
  
  // Handle different response formats
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data && Array.isArray(response.data.events)) {
    return response.data.events;
  } else if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  return response.data;
};

// Get event statistics (admin only)
export const getEventStats = async (): Promise<{
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalAttendees: number;
  averageAttendance: number;
}> => {
  const response = await axios.get(getApiUrl('/api/events/stats'));
  return response.data;
};

// Health check
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
  uptime: number;
  memory: any;
}> => {
  const response = await axios.get(getApiUrl('/api/health'));
  return response.data;
};

// Get events with enhanced filtering
export const getEventsWithFilters = async (params?: {
  limit?: number;
  page?: number;
  timeFilter?: 'upcoming' | 'past' | 'today' | 'this-week' | 'this-month';
  category?: string;
  location?: string;
  sortBy?: 'date' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}): Promise<{
  events: Event[];
  pagination: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.timeFilter) queryParams.append('timeFilter', params.timeFilter);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params?.search) queryParams.append('search', params.search);
  
  const response = await axios.get(getApiUrl(`/api/events/filter?${queryParams.toString()}`));
  return response.data;
};

// Get single event by ID
export const getEventById = async (eventId: string): Promise<Event> => {
  const response = await axios.get(getApiUrl(`/api/events/${eventId}`));
  return response.data;
};

// Check if user is enrolled in an event
export const checkEnrollmentStatus = async (eventId: string): Promise<{
  isEnrolled: boolean;
  enrollmentDate?: string;
}> => {
  const response = await axios.get(getApiUrl(`/api/events/${eventId}/enrollment-status`));
  return response.data;
};

// Get event attendees list (for enrolled users)
export const getEventAttendees = async (eventId: string): Promise<{
  attendees: Array<{
    userId: string;
    username: string;
    email: string;
    enrolledAt: string;
  }>;
  totalCount: number;
}> => {
  const response = await axios.get(getApiUrl(`/api/events/${eventId}/attendees`));
  return response.data;
};

// Helper function to format date for display
export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper function to format time for display
export const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper function to check if user is enrolled
export const isUserEnrolled = (event: Event, userId: string): boolean => {
  return event.attendees?.some(attendee => attendee.user.id === userId) || false;
};
