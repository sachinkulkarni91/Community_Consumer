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
  platform: 'Zoom' | 'Teams' | 'Google Meet' | 'In-Person';
  meetingLink?: string;
  location?: string;
  maxAttendees?: number;
  attendees: Array<{
    user: {
      id: string;
      name: string;
      username: string;
      profilePhoto: string;
    };
    enrolledAt: string;
    status: 'enrolled' | 'attended' | 'no-show';
  }>;
  category: 'Workshop' | 'Webinar' | 'Training' | 'Meeting' | 'Social' | 'Other';
  tags: string[];
  image: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isPast: boolean;
  isUpcoming: boolean;
  isLive: boolean;
  attendeeCount: number;
  availableSpots?: number;
  createdAt: string;
  updatedAt: string;
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
}): Promise<Event[]> => {
  const queryParams = new URLSearchParams();
  if (params?.community) queryParams.append('community', params.community);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.timeFilter) queryParams.append('timeFilter', params.timeFilter);
  
  const response = await axios.get(getApiUrl(`/api/events?${queryParams.toString()}`));
  return response.data;
};

// Get single event
export const getEvent = async (id: string): Promise<Event> => {
  const response = await axios.get(getApiUrl(`/api/events/${id}`));
  return response.data;
};

// Create new event (admin only)
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  const response = await axios.post(getApiUrl('/api/events'), eventData);
  return response.data;
};

// Update event (admin only)
export const updateEvent = async (id: string, eventData: Partial<CreateEventData>): Promise<Event> => {
  const response = await axios.put(getApiUrl(`/api/events/${id}`), eventData);
  return response.data;
};

// Delete event (admin only)
export const deleteEvent = async (id: string): Promise<void> => {
  await axios.delete(getApiUrl(`/api/events/${id}`));
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
  return event.attendees.some(attendee => attendee.user.id === userId);
};
