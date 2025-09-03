// src/pages/JoinCommunity.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import displayError from '../utils/error-toaster';
import { getApiUrl } from '../utils/api-url';
import { useUser } from '../Contexts/UserContext';
import { getUser } from '../services/user';

axios.defaults.withCredentials = true; // ensure cookies are sent

export default function JoinCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'undefined') { 
      setError('Invalid community ID');
      setIsJoining(false);
      return; 
    }

    let cancelled = false;
    (async () => {
      try {
        setIsJoining(true);
        
        // First check if user is already a member of this community
        const currentUserInfo = await getUser();
        console.log('Current user info:', currentUserInfo);
        console.log('User joinedCommunities:', currentUserInfo.joinedCommunities);
        
        const isAlreadyMember = currentUserInfo.joinedCommunities?.some(
          (community: any) => community.id === id || community._id === id || community === id
        );
        
        if (isAlreadyMember) {
          console.log('✅ User already a member, redirecting to feed');
          if (!cancelled) {
            navigate(`/feed`, { replace: true });
          }
          return;
        }
        
        console.log('❌ User not a member, attempting to join...');
        await axios.put(getApiUrl(`/api/communities/${encodeURIComponent(id)}/join`), {});
        
        if (!cancelled) {
          // Refresh user data to include the newly joined community
          try {
            const updatedUserInfo = await getUser();
            console.log('Updated user info after join:', updatedUserInfo);
            console.log('joinedCommunities:', updatedUserInfo.joinedCommunities);
            
            setUser({
              name: updatedUserInfo.name,
              username: updatedUserInfo.username,
              email: updatedUserInfo.email,
              id: updatedUserInfo.id,
              role: updatedUserInfo.role,
              communities: updatedUserInfo.joinedCommunities || [],
              profilePhoto: updatedUserInfo.profilePhoto
            });
          } catch (userError) {
            console.error('Error refreshing user data:', userError);
            // Still proceed even if user refresh fails
          }
          
          navigate(`/feed`, { replace: true });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error('Join community error:', err);
          displayError(err);
          setError('Failed to join community');
          setIsJoining(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [id, navigate, setUser]);

  if (error) {
    return (
      <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1>Unable to Join Community</h1>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/communities')} 
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Browse Communities
        </button>
      </div>
    );
  }

  if (isJoining) {
    return (
      <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1>Joining community…</h1>
        <p>If this takes more than a moment, refresh the page.</p>
      </div>
    );
  }

  return null;
}
