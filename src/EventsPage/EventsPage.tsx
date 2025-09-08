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
        const response = await axios.get(getApiUrl('/api/events/all'));
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
  <div className="bg-white rounded-xl border border-gray-200 shadow p-4 flex flex-col min-h-[240px] max-w-sm w-full mx-auto">
        {event.image ? (
          <img src={event.image} alt={event.title} style={{width: '262px', height: '172px'}} className="object-cover rounded-t-xl mx-auto" />
        ) : (
          <div style={{width: '262px', height: '172px'}} className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-t-xl flex items-center justify-center mx-auto">
            <svg className="w-16 h-16 text-white opacity-40" fill="none" viewBox="0 0 24 24"><path d="M8 17l4-4-4-4m8 8V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
        <h3 className="text-base font-semibold text-gray-900 mt-3 mb-2 leading-tight line-clamp-2">{event.title}</h3>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate} • {formattedTime}</span>
        </div>
        <button
          onClick={() => window.open(event.meetingLink, '_blank')}
          className="w-full py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-auto"
        >
          Enroll
        </button>
      </div>
    );
  };

  // No need to filter here since API already returns filtered data based on activeTab

  return (
  <div className="flex-1 bg-transparent min-h-screen">
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
