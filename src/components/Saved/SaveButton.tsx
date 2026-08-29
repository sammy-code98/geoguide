import { useNavigate } from "react-router-dom";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi";
import { useIsSaved, type SavedInput } from "../../store/savedStore";
import { useSavedTripsActions } from "../../hooks/useSavedTrips";
import { useAuth } from "../../auth/useAuth";
import { AppRoutes } from "../../types/routes";

interface SaveButtonProps {
  item: SavedInput;
  /** Show a text label next to the icon. */
  label?: boolean;
  /** Compact icon-only variant (e.g. overlaid on a card). */
  compact?: boolean;
}

export default function SaveButton({ item, label, compact }: SaveButtonProps): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggle } = useSavedTripsActions();
  const savedWhenAuthed = useIsSaved(item.id);
  const saved = Boolean(user) && savedWhenAuthed;

  const Icon = saved ? HiBookmark : HiOutlineBookmark;

  // Guests can't save — send them to sign in first.
  const handle = () => {
    if (!user) {
      navigate(AppRoutes.login);
      return;
    }
    toggle(item);
  };

  const ariaLabel = !user ? "Sign in to save" : saved ? "Remove from saved" : "Save";

  if (compact) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          handle();
        }}
        aria-pressed={saved}
        aria-label={ariaLabel}
        className="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/80 text-primary flex items-center justify-center shadow hover:scale-105 transition-transform"
      >
        <Icon className="text-lg" />
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handle();
      }}
      aria-pressed={saved}
      aria-label={ariaLabel}
      className="py-2 px-4 rounded shadow-sm flex items-center gap-1 text-sm font-bold text-primary bg-white dark:bg-bgDark hover:opacity-90"
    >
      <Icon />
      {label && (saved ? "Saved" : "Save")}
    </button>
  );
}
