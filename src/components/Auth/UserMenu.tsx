import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBookmark, HiOutlineUser } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/useAuth";
import { useSavedStore } from "../../store/savedStore";
import { AppRoutes } from "../../types/routes";
import Avatar from "./Avatar";

/** Avatar button + dropdown (Profile / Saved Trips / Sign out) for signed-in users. */
export default function UserMenu(): JSX.Element | null {
  const { user, signOut } = useAuth();
  const savedCount = useSavedStore((s) => s.items.length); // 19b: Firestore-backed
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const itemClass =
    "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-fg hover:bg-surface-2 text-left transition-colors";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full ring-2 ring-transparent hover:ring-primary/40 transition"
      >
        <Avatar photoURL={user.photoURL} name={user.displayName} email={user.email} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg bg-surface border border-border shadow-md overflow-hidden z-30"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-fg truncate">
              {user.displayName || "Traveler"}
            </p>
            {user.email && (
              <p className="text-xs text-muted truncate">{user.email}</p>
            )}
          </div>
          <Link to={AppRoutes.profile} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            <HiOutlineUser aria-hidden="true" />
            Profile
          </Link>
          <Link to={AppRoutes.savedTrips} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            <HiOutlineBookmark aria-hidden="true" />
            Saved trips
            {savedCount > 0 && (
              <span className="ml-auto text-xs font-bold text-primary">{savedCount}</span>
            )}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className={`${itemClass} text-secondary`}
          >
            <FiLogOut aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
