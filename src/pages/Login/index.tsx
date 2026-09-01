import { FcGoogle } from "react-icons/fc";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { AppRoutes } from "../../types/routes";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

/**
 * Guest-only sign-in page. Redirects authenticated users back to where they
 * came from (RequireAuth stashes it in `state.from`), or to their profile.
 */
export default function LoginPage(): JSX.Element {
  const { user, signIn, error } = useAuth();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    AppRoutes.profile;

  if (user) return <Navigate to={from} replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
          <HiOutlineGlobeAlt aria-hidden="true" />
        </div>
        <div className="mt-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-fg">
            Welcome to GeoGuide
          </h1>
          <p className="text-muted">
            Sign in to save trips, sync across devices, and keep your travel conversations.
          </p>
        </div>

        <Button variant="outline" size="lg" onClick={signIn} className="w-full mt-6">
          <FcGoogle className="text-xl" aria-hidden="true" />
          Continue with Google
        </Button>

        {error && (
          <p className="text-danger text-sm mt-4" role="alert">
            {error}
          </p>
        )}

        <p className="text-xs text-muted mt-6">
          We only use your Google account for sign-in. GeoGuide never sees your password.
        </p>
      </Card>
    </div>
  );
}
