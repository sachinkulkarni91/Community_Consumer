// src/pages/JoinCommunity.tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import displayError from '../utils/error-toaster';

axios.defaults.withCredentials = true; // ensure cookies are sent

export default function JoinCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const msg = 'Joining community…';

  useEffect(() => {
    if (!id) { navigate('/404'); return; }

    let cancelled = false;
    (async () => {
      try {
        await axios.put(`/api/communities/${encodeURIComponent(id)}/join`, {});
        if (!cancelled) navigate(`/feed`, { replace: true });
      } catch (err : unknown) {
        displayError(err);
      }
    })();

    return () => { cancelled = true; };
  }, [id, navigate]);

  return (
    <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%'  }}>
      <h1>{msg}</h1>
      <p>If this takes more than a moment, refresh the page.</p>
    </div>
  );
}
