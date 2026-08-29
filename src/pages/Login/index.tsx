import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi2";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { AppRoutes } from "../../types/routes";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-3xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-3xl">
          <HiSparkles aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-textWhite">
            Welcome to GeoGuide
          </h1>
          <p className="text-textGray dark:text-grayish">
            Sign in to save trips, sync across devices, and keep your AI chat history.
          </p>
        </div>

        <button
          type="button"
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white dark:bg-bgDark border border-gray-300 dark:border-gray-600 text-black dark:text-textWhite font-semibold shadow-sm hover:shadow-md transition-shadow"
        >
          <FcGoogle className="text-xl" aria-hidden="true" />
          Continue with Google
        </button>

        {error && (
          <p className="text-secondary text-sm" role="alert">
            {error}
          </p>
        )}

        <p className="text-xs text-textGray dark:text-grayish">
          We only use your Google account for sign-in. GeoGuide never sees your password.
        </p>
      </div>
    </div>
  );
}
