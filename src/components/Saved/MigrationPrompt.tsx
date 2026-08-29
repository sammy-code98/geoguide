import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HiOutlineBookmark } from "react-icons/hi";
import { useAuth } from "../../auth/useAuth";
import type { SavedItem } from "../../store/savedStore";
import { importTrips, mergeSavedById } from "../../services/firebase/TripService";
import { Button } from "../ui/button";

const LEGACY_KEY = "geoguide.saved";
const MIGRATED_KEY = "geoguide.migrated";

/** Read the pre-19b Zustand-persisted saved trips (if any) from localStorage. */
function readLegacySaved(): SavedItem[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // zustand/persist wraps state as { state: { items }, version }.
    const items = Array.isArray(parsed) ? parsed : parsed?.state?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

/**
 * One-time prompt: when a signed-in user has trips saved locally (from before
 * cloud sync), offer to import them into their account. Merges by id and clears
 * the local copy once done.
 */
export default function MigrationPrompt(): JSX.Element | null {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [legacy] = useState(readLegacySaved);
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyMigrated = localStorage.getItem(MIGRATED_KEY) === "1";
  if (!user || dismissed || alreadyMigrated || legacy.length === 0) return null;

  const runImport = async () => {
    setBusy(true);
    setError(null);
    try {
      const uid = user.uid;
      const remote = qc.getQueryData<SavedItem[]>(["savedTrips", uid]) ?? [];
      await importTrips(uid, legacy);
      qc.setQueryData<SavedItem[]>(["savedTrips", uid], mergeSavedById(remote, legacy));
      qc.invalidateQueries({ queryKey: ["savedTrips", uid] });
      localStorage.setItem(MIGRATED_KEY, "1");
      localStorage.removeItem(LEGACY_KEY);
      setDismissed(true);
    } catch (e) {
      setError((e as Error)?.message || "Import failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl">
      <div
        role="dialog"
        aria-label="Import saved trips"
        className="bg-surface border border-border rounded-lg shadow-md p-4 flex items-center gap-3"
      >
        <HiOutlineBookmark className="text-2xl text-primary shrink-0" aria-hidden="true" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-fg">
            Import {legacy.length} saved {legacy.length === 1 ? "trip" : "trips"}?
          </p>
          <p className="text-muted">
            We found trips saved on this device. Add them to your account to sync everywhere.
          </p>
          {error && (
            <p className="text-danger mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <Button size="sm" onClick={runImport} disabled={busy}>
            {busy ? "Importing…" : "Import"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)} disabled={busy}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
