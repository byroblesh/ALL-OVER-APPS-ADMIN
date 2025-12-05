// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "@/app/contexts/auth/context";
import { HOME_PATH, REDIRECT_URL_KEY } from "@/constants/app";

// ----------------------------------------------------------------------


export default function GhostGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  const redirectUrl = new URLSearchParams(window.location.search).get(
    REDIRECT_URL_KEY,
  );

  if (isAuthenticated) {
    // Redirect to requested URL if it exists, otherwise go to home
    if (redirectUrl && redirectUrl !== "null") {
      return <Navigate to={redirectUrl} replace />;
    }
    return <Navigate to={HOME_PATH} replace />;
  }

  return <>{outlet}</>;
}
