import { Link } from "react-router-dom";
import { HiOutlineBookmark } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/useAuth";
import { useCurrentUser } from "../../auth/useCurrentUser";
import { useSavedStore } from "../../store/savedStore";
import Avatar from "../../components/Auth/Avatar";
import { AppRoutes } from "../../types/routes";

const formatDate = (ms: number | null) =>
  ms ? new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

export default function ProfilePage(): JSX.Element {
  const user = useCurrentUser();
  const { signOut } = useAuth();
  // Saved-trips count reflects the Firestore-synced store (19b).
  // Conversations count is wired live in 19c.
  const savedCount = useSavedStore((s) => s.items.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8">
        {/* Identity */}
        <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <Avatar
            photoURL={user.photoURL}
            name={user.displayName}
            email={user.email}
            className="w-24 h-24 text-3xl"
          />
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-textWhite">
              {user.displayName || "Traveler"}
            </h1>
            {user.email && <p className="text-textGray dark:text-grayish">{user.email}</p>}
            <p className="text-sm text-textGray dark:text-grayish">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={AppRoutes.savedTrips}
            className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-colors"
          >
            <HiOutlineBookmark className="text-3xl text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xl font-bold text-black dark:text-textWhite">{savedCount}</p>
              <p className="text-sm text-textGray dark:text-grayish">Saved trips</p>
            </div>
          </Link>
          <Link
            to={AppRoutes.chat}
            className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-colors"
          >
            <HiSparkles className="text-3xl text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xl font-bold text-black dark:text-textWhite">—</p>
              <p className="text-sm text-textGray dark:text-grayish">AI conversations</p>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 py-3 px-6 rounded-xl bg-secondary/10 text-secondary font-semibold hover:bg-secondary/20 transition-colors"
          >
            <FiLogOut aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
