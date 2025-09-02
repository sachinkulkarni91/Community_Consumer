import { useSearchParams, useParams } from "react-router-dom";
import { getApiUrl } from "../utils/api-url";
import displayError from "../utils/error-toaster";
import { useEffect, useState } from "react";

const RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the token from either query parameter or path parameter
  const code = searchParams.get("t") || token;

  useEffect(() => {
    if (!code) {
      setIsLoading(false);
      return;
    }

    const redirectTo = async () => {
      try {
        // Instead of using axios, just redirect directly to the backend invite handler
        // The backend will set the invite cookie and redirect to the appropriate frontend page
        const backendUrl = getApiUrl(`/community/redirect?t=${code}`);
        window.location.href = backendUrl;
      } catch (error) {
        console.error('Redirect error:', error);
        displayError(error);
        setIsLoading(false);
      }
    };
    
    redirectTo();
  }, [code]);

  if (!code) {
    return <div className="p-8 text-center text-lightText">Invalid invite link - missing token</div>;
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-lightText">
        <div>Redirecting...</div>
        <div className="mt-2 text-sm">Processing your invite link...</div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-lightText">
      <div>Unable to process invite link</div>
      <div className="mt-2 text-sm">Please check if the link is valid or try again.</div>
    </div>
  );
}

export default RedirectPage