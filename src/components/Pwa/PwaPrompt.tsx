import { useEffect, useState, type ReactNode } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { PiArrowsClockwiseDuotone, PiCloudSlashDuotone, PiSuitcaseRollingDuotone } from "react-icons/pi";
import { Button } from "../ui/button";
import { TONES, type Tone } from "../ui/postcard";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { cn } from "../../lib/cn";

/** How often an open tab checks for a newer deploy. */
const UPDATE_CHECK_MS = 60 * 60 * 1000;
/** How long the one-time "works offline" note stays up. */
const OFFLINE_READY_MS = 8000;

interface NoteProps {
  tone: Tone;
  icon: ReactNode;
  title: string;
  message: string;
  children?: ReactNode;
}

/** A small postcard pinned to the corner of the screen. */
function Note({ tone, icon, title, message, children }: NoteProps): JSX.Element {
  const t = TONES[tone];
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-2xl border border-border px-4 py-3.5 shadow-card",
        "animate-note-in motion-reduce:animate-none",
        t.block
      )}
    >
      <span
        className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-xl", t.ink)}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-base font-semibold text-fg">{title}</p>
        <p className="mt-0.5 text-sm text-fg/75">{message}</p>
        {children && <div className="mt-3 flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}

/**
 * The app's service-worker voice: offers a new version when one is deployed,
 * confirms once that GeoGuide works offline, and says when the connection drops.
 */
export default function PwaPrompt(): JSX.Element {
  const online = useOnlineStatus();
  const [offlineDismissed, setOfflineDismissed] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Long-lived tabs (and installed apps) still hear about new deploys.
      if (registration) setInterval(() => void registration.update(), UPDATE_CHECK_MS);
    },
  });

  useEffect(() => {
    if (!offlineReady) return;
    const id = setTimeout(() => setOfflineReady(false), OFFLINE_READY_MS);
    return () => clearTimeout(id);
  }, [offlineReady, setOfflineReady]);

  // A fresh drop in connection deserves a fresh notice.
  useEffect(() => {
    if (online) setOfflineDismissed(false);
  }, [online]);

  const showOffline = !online && !offlineDismissed;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-4 right-20 z-40 flex flex-col gap-3 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[380px]"
    >
      {showOffline && (
        <Note
          tone="sand"
          icon={<PiCloudSlashDuotone />}
          title="You're offline"
          message="Countries and pages you've already opened still work. Planning with AI needs a connection."
        >
          <Button size="sm" variant="outline" className="bg-surface" onClick={() => setOfflineDismissed(true)}>
            Got it
          </Button>
        </Note>
      )}

      {needRefresh && (
        <Note
          tone="sea"
          icon={<PiArrowsClockwiseDuotone />}
          title="A new version is ready"
          message="Reload to get the latest GeoGuide. Anything you haven't saved on this page will be cleared."
        >
          <Button size="sm" onClick={() => void updateServiceWorker(true)}>
            Reload
          </Button>
          <Button size="sm" variant="outline" className="bg-surface" onClick={() => setNeedRefresh(false)}>
            Later
          </Button>
        </Note>
      )}

      {offlineReady && !needRefresh && (
        <Note
          tone="olive"
          icon={<PiSuitcaseRollingDuotone />}
          title="Ready for the road"
          message="GeoGuide now opens without a connection, along with the places you've visited."
        >
          <Button size="sm" variant="outline" className="bg-surface" onClick={() => setOfflineReady(false)}>
            Got it
          </Button>
        </Note>
      )}
    </div>
  );
}
