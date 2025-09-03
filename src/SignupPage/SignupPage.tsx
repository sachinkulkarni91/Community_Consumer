import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {getUser} from '../services/user';
import { useUser } from '../Contexts/UserContext';
import displayError from '../utils/error-toaster';
import Input from '../CommonComponents/Input';
import { signup, signupWithInvite, regularSignup } from '../services/signup';
import { getInviteInfo } from '../services/invite';


// Signup page component

const SignupPage = () => {
  // Handle return URL for community invite
  const params = new URLSearchParams(location.search);
  const returnTo = params.get("return_to")
  const inviteId = params.get("invite")

  const navigate = useNavigate();
  const {setUser} = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [inviteInfo, setInviteInfo] = useState<any>(null);
  const [isInviteUser, setIsInviteUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for invite on component mount
  useEffect(() => {
    const checkInvite = async () => {
      if (inviteId) {
        try {
          const info = await getInviteInfo();
          setInviteInfo(info);
          
          if (info.type === 'user' && info.invitedEmail) {
            // User-specific invite - pre-fill all data
            setIsInviteUser(true);
            setEmail(info.invitedEmail);
            setName(info.invitedName || '');
            setUsername(info.invitedUsername || '');
          } else if (info.type === 'community') {
            // Community invite - regular signup flow
            setIsInviteUser(false);
          }
        } catch (error) {
          console.error('No valid invite found:', error);
          setIsInviteUser(false);
        }
      } else {
        setIsInviteUser(false);
      }
      setIsLoading(false);
    };
    checkInvite();
  }, [inviteId]);

  // Handle signup
  const handleSignup = async ()  => {
    // Validate password confirmation
    if (password !== confirmPassword) {
      displayError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      displayError("Password must be at least 6 characters long");
      return;
    }

    try {
      if (isInviteUser) {
        // Use invite-based signup - the backend will get the token from the cookie
        await signupWithInvite(password);
      } else {
        // Regular signup
        if (!email || !name || !username) {
          displayError("Please fill in all required fields");
          return;
        }
        await regularSignup(username, password, name, email);
      }

      const userInfo = await getUser();
      setUser({
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
        id: userInfo.id,
        communities: userInfo.joinedCommunities,
        profilePhoto: userInfo.profilePhoto
      })
      
      if (returnTo) {
        window.location.href = returnTo;
      } else if (inviteId) {
        navigate(`/community/join/${inviteId}`)
      } else {
        navigate('/feed')
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.data?.error) {
        displayError(error.response.data.error);
      } else {
        displayError("An error occurred during signup. Please try again.");
      }
    } finally {
      // Clear passwords
      setPassword("")
      setConfirmPassword("")
      // Only clear other fields for non-invite users
      if (!isInviteUser) {
        setEmail("")
        setUsername("")
        setName("")
      }
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center aspect-[16/9] w-full'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center aspect-[16/9] w-full gap-10'>
      <div className='h-3/4 w-1/2 bg-primary rounded-4xl flex justify-center'>
        <div className='w-3/4 max-w-[550px] bg-primary rounded-4xl flex flex-col text-lightText'> 
          <div className='text-4xl text-left text-text mb-4'> <b>Welcome to Knitspace</b></div>
          <div className='text-lg text-left mb-6'>
            {isInviteUser ? 'Complete your account setup' : 'Create a new account'}
          </div>
          
          {isInviteUser && (
            <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800'>
                🎯 You've been invited to join! Your profile information is already set up. Just create a password to complete your account.
              </p>
            </div>
          )}
          
          {/* Show all fields for regular signup, only password fields for invite users */}
          {!isInviteUser && (
            <>
              <Input 
                label="Email" 
                type="text" 
                id="Email" 
                placeholder="Enter your email" 
                value={email} 
                setValue={setEmail}
              />
              
              <Input 
                label="Name" 
                type="text" 
                id="Name" 
                placeholder="Enter your Name" 
                value={name} 
                setValue={setName}
              />
              
              <Input 
                label="Username" 
                type="text" 
                id="Username" 
                placeholder="Enter a username" 
                value={username} 
                setValue={setUsername}
              />
            </>
          )}

          {isInviteUser && (
            <div className='mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
              <div className='text-sm text-gray-700'>
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Name:</strong> {name}</div>
                <div><strong>Username:</strong> {username}</div>
              </div>
            </div>
          )}

          {/* Password fields - always shown */}
          <Input 
            label="Password" 
            type="password" 
            id="Password" 
            placeholder="Enter your new password" 
            value={password} 
            setValue={setPassword} 
          />
          
          {/* Confirm password - always shown */}
          <Input 
            label="Confirm Password" 
            type="password" 
            id="ConfirmPassword" 
            placeholder="Confirm your password" 
            value={confirmPassword} 
            setValue={setConfirmPassword} 
          />

          {/* Show validation for password match */}
          {confirmPassword && (
            <div className={`mt-1 mb-3 text-sm ${
              password === confirmPassword 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {password === confirmPassword ? '✓ Passwords match' : '⚠ Passwords do not match'}
            </div>
          )}

          <div className='flex items-center h-[48px] gap-16'>
            <div className='flex-2/3 text-left text-md'></div>
            <button 
              className={`flex-1/3 max-w-[100px] text-sm text-white py-2 px-2 rounded-3xl w-full flex justify-center items-center gap-1 transition-all duration-300 border-2 my-8 ${
                (password !== confirmPassword || password.length < 6)
                  ? 'bg-gray-400 border-gray-400 cursor-not-allowed'
                  : 'bg-KPMG border-KPMG hover:bg-white hover:text-KPMG'
              }`} 
              onClick={() => {handleSignup()}}
              disabled={password !== confirmPassword || password.length < 6}
            >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-arrow-right-short"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 
              .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
            />
          </svg>
            {isInviteUser ? 'Complete Setup' : 'Signup'}
          </button>
          </div>
          
        </div>

      </div>
      
      
      <div className='w-2/5 h-3/4 overflow-hidden rounded-4xl flex items-center my-auto'><img className='w-full h-full object-cover object-[75%_85%]' src="./assets/generic2.jpg" alt="" /></div></div>
  )
}

export default SignupPage