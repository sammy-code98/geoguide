import { useSyncExternalStore } from "react";

/** Chromium's install event; not in the DOM typings yet. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// The browser fires `beforeinstallprompt` once, often before React mounts the
// component that wants it, so the event is captured here at import time and
// handed to whoever subscribes later.
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // we show our own "Install app" button instead
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/**
 * Whether the app can be installed right now, and a function that opens the
 * browser's install dialog. `canInstall` is false on browsers without an
 * install prompt (Safari, Firefox) and once the app is installed.
 */
export function useInstallPrompt(): { canInstall: boolean; install: () => Promise<void> } {
  const event = useSyncExternalStore(subscribe, () => deferred, () => null);
  return {
    canInstall: event !== null,
    install: async () => {
      if (!deferred) return;
      const e = deferred;
      deferred = null; // the event can only be used once
      emit();
      await e.prompt();
    },
  };
}
