import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { enrollInEvent, unenrollFromEvent, isUserEnrolled, type Event } from '../services/events';
import { useUser } from '../Contexts/UserContext';
import axios from 'axios';
import { getApiUrl } from '../utils/api-url';

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'past'>('new');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setEvents([]); // Start with empty array for both tabs
      
      // Fetch real data from API
      try {
        console.log('🔍 Fetching events for tab:', activeTab);
        const timeFilter = activeTab === 'new' ? 'upcoming' : 'past';
        
        // Use the specific API endpoint you provided
        const response = await axios.get(getApiUrl('/api/events/'));
        const eventsData = response.data;
        console.log('📦 Raw API Response:', eventsData);
        console.log('📊 Response type:', typeof eventsData);
        console.log('🔢 Response length:', Array.isArray(eventsData) ? eventsData.length : 'Not an array');
        
        // The service now handles response parsing, so eventsData should be an array
        let eventsArray: Event[] = [];
        
        // Handle different response formats
        if (Array.isArray(eventsData)) {
          eventsArray = eventsData;
        } else if (eventsData && Array.isArray(eventsData.events)) {
          eventsArray = eventsData.events;
        } else if (eventsData && Array.isArray(eventsData.data)) {
          eventsArray = eventsData.data;
        }
        
        // Filter events based on active tab (since we're getting all events)
        const now = new Date();
        const filteredEvents = eventsArray.filter(event => {
          const eventDate = new Date(event.startDateTime);
          if (activeTab === 'new') {
            return eventDate >= now; // Upcoming events
          } else {
            return eventDate < now; // Past events
          }
        });
        
        console.log('✅ Got events array with', eventsArray.length, 'total events');
        console.log('🔍 Filtered to', filteredEvents.length, timeFilter, 'events');
        console.log('📋 Events preview:', filteredEvents.map(e => ({ id: e.id, title: e.title, community: e.community?.name })));
        
        if (filteredEvents.length > 0) {
          setEvents(filteredEvents);
          console.log('Using filtered events from API:', filteredEvents.length);
        } else {
          console.log(`No ${activeTab === 'new' ? 'upcoming' : 'past'} events from API`);
          // Keep empty array for both tabs (will show appropriate "No events found" message)
        }
        
        setLoading(false);
      } catch (apiError) {
        console.log('API call failed:', apiError);
        console.log('API error details:', (apiError as any)?.response?.data);
        // Keep empty array for both tabs (will show appropriate "No events found" message)
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      setLoading(false);
    }
  };

  const handleEnrollment = async (eventId: string, isEnrolled: boolean) => {
    try {
      if (isEnrolled) {
        await unenrollFromEvent(eventId);
        toast.success('Successfully unenrolled from event');
      } else {
        await enrollInEvent(eventId);
        toast.success('Successfully enrolled in event');
      }
      // Refresh events to get updated enrollment status
      fetchEvents();
    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast.error('Failed to update enrollment');
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const userEnrolled = user ? isUserEnrolled(event, user.id) : false;
    // Format date to match admin exactly: 15/3/2024 • 10:00
    const eventDate = new Date(event.startDateTime);
    const formattedDate = `${eventDate.getDate()}/${eventDate.getMonth() + 1}/${eventDate.getFullYear()}`;
    const formattedTime = eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: false 
    });
    return (
      <div className="rounded-lg shadow-sm overflow-hidden">
        {/* Event Image with Gradient Background - reduced height */}
        <div className="relative h-28 overflow-hidden">
          {/* Event Image */}
          {event.image && (
            <img 
              src={event.image} 
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Gradient background overlay - only show if no image or as overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: event.image ? 
                `linear-gradient(135deg, 
                  rgba(79, 70, 229, 0.7) 0%, 
                  rgba(124, 58, 237, 0.7) 25%, 
                  rgba(37, 99, 235, 0.7) 50%, 
                  rgba(14, 165, 233, 0.7) 75%, 
                  rgba(6, 182, 212, 0.7) 100%
                )` :
                `linear-gradient(135deg, 
                  #4F46E5 0%, 
                  #7C3AED 25%, 
                  #2563EB 50%, 
                  #0EA5E9 75%, 
                  #06B6D4 100%
                )`
            }}
          >
            {/* Wave pattern overlay */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: "rgba(255,255,255,0.2)"}} />
                    <stop offset="50%" style={{stopColor: "rgba(255,255,255,0.1)"}} />
                    <stop offset="100%" style={{stopColor: "rgba(255,255,255,0.05)"}} />
                  </linearGradient>
                </defs>
                {/* Multiple wave layers for depth */}
                <path d="M0,80 C80,20 160,140 240,60 C320,100 360,40 400,80 L400,160 L0,160 Z" 
                      fill="url(#waveGradient)" opacity="0.6"/>
                <path d="M0,100 C100,40 200,120 300,80 C350,60 380,90 400,70 L400,160 L0,160 Z" 
                      fill="rgba(255,255,255,0.1)" opacity="0.4"/>
                <path d="M0,120 C120,60 240,100 360,80 C380,75 390,85 400,80 L400,160 L0,160 Z" 
                      fill="rgba(255,255,255,0.05)" opacity="0.3"/>
              </svg>
            </div>
          </div>
          
          {/* Partner Event Badge - smaller */}
          <div className="absolute top-2 left-2">
            <span className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Partner Event
            </span>
          </div>
          
          {/* Three dots menu - smaller */}
          <div className="absolute top-2 right-2">
            <button className="p-1 rounded-full hover:bg-black/10 transition-colors">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Event Content - reduced padding */}
        <div className="p-3 bg-transparent">
          {/* Event Title - smaller font */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
            {event.title}
          </h3>

          {/* Date and Time - smaller */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          {/* Enroll Button - only for upcoming events */}
          {eventDate >= new Date() && event.meetingLink && (
            <button
              onClick={() => window.open(event.meetingLink, '_blank')}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    );
  };

  // No need to filter here since API already returns filtered data based on activeTab

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        </div>

        {/* Tabs and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                activeTab === 'new'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                activeTab === 'past'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past events
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filter
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View calendar
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto scrollbar-hide" style={{WebkitOverflowScrolling: 'touch'}}>
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : !Array.isArray(events) || events.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-500">
                {activeTab === 'past' ? 'No past events found' : 'No upcoming events found'}
              </div>
            </div>
          ) : (
            events.map((event: Event, index) => {
              console.log(`🎯 Rendering event ${index + 1}:`, { 
                id: event.id, 
                title: event.title, 
                community: event.community?.name,
                startDateTime: event.startDateTime,
                hasImage: !!event.image
              });
              return <EventCard key={event.id || index} event={event} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

// Add this to your global CSS or index.css if not present:
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
