import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface AnnouncementObj {
  header: string;
  subcontent: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<AnnouncementObj[]>('/api/announcements')
      .then((res) => {
        setAnnouncements(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load announcements');
        setLoading(false);
        toast.error('Failed to load announcements');
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8" style={{ width: '100%' }}>
      <h2 className="text-2xl font-bold mb-6">Announcements</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-gray-600 mb-2">No announcements available.</div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-300 rounded-xl shadow px-6 py-4 text-base"
            >
              <div className="font-semibold mb-1">{a.header}</div>
              {a.subcontent && <div className="text-gray-700 text-sm">{a.subcontent}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
