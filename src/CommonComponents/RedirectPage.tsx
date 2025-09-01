import { useSearchParams } from "react-router-dom";
import { getRedirect } from "../services/redirect";
import displayError from "../utils/error-toaster";

const RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("t");

  if (!code) {
    return <div className="p-8 text-center text-lightText">Invalid invite link</div>;
  }

    const redirectTo = async () => {
      try {
        const response = await getRedirect(code);
        console.log('response.redirectUrl', response.redirectUrl)
        window.location.href = response.redirectUrl;
      } catch (error) {
        displayError(error);
      }
    };
    redirectTo();

  return (
    <div className="p-8 text-center text-lightText">Redirecting...</div>
  )
}

export default RedirectPage