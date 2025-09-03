import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';
import { getUser } from '../services/user';
import displayError from '../utils/error-toaster';
import Input from '../CommonComponents/Input';
import { changeFirstTimePassword } from '../services/password';

const ChangePasswordPage = () => {
  const params = new URLSearchParams(location.search);
  const returnTo = params.get("return_to");
  const inviteId = params.get("invite");

  const navigate = useNavigate();
  const { setUser } = useUser();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in and needs password change
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUser();
        if (!user.firstLogin) {
          // User doesn't need password change, redirect to feed
          navigate('/feed');
          return;
        }
        setUserInfo(user);
      } catch (error) {
        // User not logged in, redirect to login
        navigate('/login');
        return;
      }
      setIsLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handlePasswordChange = async () => {
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
      await changeFirstTimePassword(password);
      
      // Get updated user info
      const updatedUser = await getUser();
      setUser({
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        id: updatedUser.id,
        communities: updatedUser.joinedCommunities,
        profilePhoto: updatedUser.profilePhoto
      });

      // Redirect based on invite or return URL
      if (returnTo) {
        window.location.href = returnTo;
      } else if (inviteId) {
        navigate(`/feed?invite=${inviteId}`);
      } else {
        navigate('/feed');
      }

    } catch (error: any) {
      console.error('Password change error:', error);
      if (error.response?.data?.error) {
        displayError(error.response.data.error);
      } else {
        displayError("An error occurred while changing password. Please try again.");
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
            Complete your account setup - Change your password
          </div>
          
          <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <p>
              👋 Welcome {(userInfo?.name ?? '').trim().replace(/^./, (c: string) => c.toUpperCase())}!
            </p>
            <p>
                Please change your temporary password to complete your account setup.
            </p>
          </div>


          <Input 
            label="New Password" 
            type="password" 
            id="Password" 
            placeholder="Enter your new password" 
            value={password} 
            setValue={setPassword} 
          />
          
          <Input 
            label="Confirm New Password" 
            type="password" 
            id="ConfirmPassword" 
            placeholder="Confirm your new password" 
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
              className={`flex-1/3 max-w-[160px] text-xs font-semibold py-2 px-4 rounded-lg w-full flex justify-center items-center gap-1 transition-all duration-300 shadow-md transform ${
                (password !== confirmPassword || password.length < 6)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 border-0'
              }`} 
              onClick={() => {handlePasswordChange()}}
              disabled={password !== confirmPassword || password.length < 6}
            >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-shield-check"
            viewBox="0 0 16 16"
          >
            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
          </svg>
            Change Password
          </button>
          </div>
          
        </div>

      </div>
      
      <div className='w-2/5 h-3/4 overflow-hidden rounded-4xl flex items-center my-auto'>
        <img className='w-full h-full object-cover object-[75%_85%]' src="./assets/generic2.jpg" alt="" />
      </div>
    </div>
  )
}

export default ChangePasswordPage
