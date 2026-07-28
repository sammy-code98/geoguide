import { HiBookmark, HiOutlineBookmark } from "react-icons/hi";
import { useIsSaved, useSavedStore, type SavedInput } from "../../store/savedStore";

interface SaveButtonProps {
  item: SavedInput;
  /** Show a text label next to the icon. */
  label?: boolean;
  /** Compact icon-only variant (e.g. overlaid on a card). */
  compact?: boolean;
}

export default function SaveButton({ item, label, compact }: SaveButtonProps): JSX.Element {
  const saved = useIsSaved(item.id);
  const toggle = useSavedStore((s) => s.toggle);

  const Icon = saved ? HiBookmark : HiOutlineBookmark;

  if (compact) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(item);
        }}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved" : "Save"}
        className="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/80 text-primary flex items-center justify-center shadow hover:scale-105 transition-transform"
      >
        <Icon className="text-lg" />
      </button>
    );
  }

  return (
    <button
      onClick={() => toggle(item)}
      aria-pressed={saved}
      className="py-2 px-4 rounded shadow-sm flex items-center gap-1 text-sm font-bold text-primary bg-white dark:bg-bgDark hover:opacity-90"
    >
      <Icon />
      {label && (saved ? "Saved" : "Save")}
    </button>
  );
}
