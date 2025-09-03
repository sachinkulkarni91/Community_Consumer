import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {getUser} from '../services/user';
import { useUser } from '../Contexts/UserContext';
import displayError from '../utils/error-toaster';
import Input from '../CommonComponents/Input';
import { signup } from '../services/signup';
import { getInviteInfo, getInvitedUserInfo } from '../services/invite';
import { generateUsernameFromName } from '../utils/username-generator';


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
  const [hasInvite, setHasInvite] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState("");
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [isReadonly, setIsReadonly] = useState(false);

  // Check if user came through an invite link
  useEffect(() => {
    const checkInvite = async () => {
      if (inviteId) {
        try {
          await getInviteInfo();
          setHasInvite(true);
        } catch (error) {
          console.error('No valid invite found:', error);
        }
      }
    };
    checkInvite();
  }, [inviteId]);

  // Fetch user data when email is entered (for invite users)
  useEffect(() => {
    const fetchUserData = async () => {
      if (hasInvite && email && email.includes('@') && !userDataLoaded) {
        try {
          const userData = await getInvitedUserInfo(email);
          setName(userData.name || '');
          setUsername(generateUsernameFromName(userData.name || ''));
          setUserDataLoaded(true);
          setIsReadonly(true);
          setEmailValidationMessage("✓ Email and profile data loaded");
        } catch (error: any) {
          setEmailValidationMessage(error.response?.data?.error || "This email was not invited");
          setUserDataLoaded(false);
          setIsReadonly(false);
          setName('');
          setUsername('');
        }
      }
    };

    const timeoutId = setTimeout(fetchUserData, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [email, hasInvite, userDataLoaded]);

  // Reset data when email changes
  useEffect(() => {
    if (hasInvite && email !== '') {
      setUserDataLoaded(false);
    }
  }, [email, hasInvite]);

  // Handle user signup and set user context
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

    // If this is an invite signup, validate that user data is loaded
    if (hasInvite && !userDataLoaded) {
      displayError("Please enter a valid invited email address first");
      return;
    }

    try {
      await signup(username, password, name, email);
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
      // Provide more specific error messages for invite-related errors
      if (hasInvite && error.response?.data?.error?.includes("Invalid email")) {
        displayError("This email address was not invited or has already completed signup. Please check the email address or contact your administrator.");
      } else if (hasInvite && error.response?.data?.error?.includes("already completed")) {
        displayError("This account has already been activated. Please try logging in instead.");
      } else {
        displayError(error);
      }
    } finally {
      // Don't clear fields for invite users since they're pre-filled
      if (!hasInvite) {
        setEmail("")
        setUsername("")
        setPassword("")
        setConfirmPassword("")
        setName("")
      } else {
        setPassword("")
        setConfirmPassword("")
      }
    }
  }

  return (
    <div className='flex justify-center items-center aspect-[16/9] w-full gap-10'>
      <div className='h-3/4 w-1/2 bg-primary rounded-4xl flex justify-center'>
        <div className='w-3/4 max-w-[550px] bg-primary rounded-4xl flex flex-col text-lightText'> 
          <div className='text-4xl text-left text-text mb-4'> <b>Welcome to Knitspace</b></div>
          <div className='text-lg text-left mb-6'>
            {hasInvite ? 'Complete your account setup' : 'Create a new account'}
          </div>
          
          {hasInvite && (
            <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800'>
                🎯 You're setting up your account through an invite. Enter your email to load your profile information.
              </p>
            </div>
          )}
          
          <Input 
            label="Email" 
            type="text" 
            id="Email" 
            placeholder="Enter your email" 
            value={email} 
            setValue={setEmail}
            disabled={hasInvite && isReadonly}
          />
          
          {hasInvite && emailValidationMessage && (
            <div className={`mt-1 mb-3 text-sm ${
              emailValidationMessage.startsWith('✓') 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {emailValidationMessage}
            </div>
          )}

          {/* Show name and username fields for regular signup or as readonly for invite signup */}
          {(!hasInvite || userDataLoaded) && (
            <>
              <Input 
                label="Name" 
                type="text" 
                id="Name" 
                placeholder="Enter your Name" 
                value={name} 
                setValue={setName}
                disabled={hasInvite && isReadonly}
              />
              <Input 
                label="Username" 
                type="text" 
                id="Username" 
                placeholder="Enter a username" 
                value={username} 
                setValue={setUsername}
                disabled={hasInvite && isReadonly}
              />
            </>
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
                hasInvite && (!userDataLoaded || password !== confirmPassword || password.length < 6)
                  ? 'bg-gray-400 border-gray-400 cursor-not-allowed'
                  : 'bg-KPMG border-KPMG hover:bg-white hover:text-KPMG'
              }`} 
              onClick={() => {handleSignup()}}
              disabled={hasInvite && (!userDataLoaded || password !== confirmPassword || password.length < 6)}
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
            {hasInvite ? 'Complete Setup' : 'Signup'}
          </button>
          </div>
          
        </div>

      </div>
      
      
      <div className='w-2/5 h-3/4 overflow-hidden rounded-4xl flex items-center my-auto'><img className='w-full h-full object-cover object-[75%_85%]' src="./assets/generic2.jpg" alt="" /></div></div>
  )
}

export default SignupPage