import { Link } from "react-router-dom";
import { HiOutlineBookmark } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight, HiOutlineGlobeAlt } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/useAuth";
import { useCurrentUser } from "../../auth/useCurrentUser";
import { useSavedStore } from "../../store/savedStore";
import { useChats } from "../../hooks/useChats";
import Avatar from "../../components/Auth/Avatar";
import { Button } from "../../components/ui/button";
import { Stamp } from "../../components/ui/postcard";
import { AppRoutes } from "../../types/routes";

const formatDate = (ms: number | null) =>
  ms ? new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

export default function ProfilePage(): JSX.Element {
  const user = useCurrentUser();
  const { signOut } = useAuth();
  const savedCount = useSavedStore((s) => s.items.length);
  const { chats } = useChats();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pt-32 space-y-8">
        <header className="relative overflow-hidden rounded-2xl bg-olive-soft px-6 py-10 sm:px-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <Stamp
            tone="olive"
            icon={<HiOutlineGlobeAlt />}
            label="Traveler"
            className="absolute right-6 top-6 hidden sm:block"
          />
          <Avatar
            photoURL={user.photoURL}
            name={user.displayName}
            email={user.email}
            className="w-24 h-24 text-3xl ring-4 ring-surface"
          />
          <div className="space-y-1 sm:pr-24">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-fg">
              {user.displayName || "Traveler"}
            </h1>
            {user.email && <p className="text-fg/75">{user.email}</p>}
            <p className="text-sm text-fg/75">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={AppRoutes.savedTrips}
            className="bg-surface border border-border rounded-lg p-6 flex items-center gap-4 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HiOutlineBookmark className="text-3xl text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xl font-semibold text-fg">{savedCount}</p>
              <p className="text-sm text-muted">Saved trips</p>
            </div>
          </Link>
          <Link
            to={AppRoutes.chat}
            className="bg-surface border border-border rounded-lg p-6 flex items-center gap-4 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HiOutlineChatBubbleLeftRight className="text-3xl text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xl font-semibold text-fg">{chats.length}</p>
              <p className="text-sm text-muted">Conversations</p>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div>
          <Button variant="outline" onClick={signOut}>
            <FiLogOut aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
