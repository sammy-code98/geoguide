import { useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); 
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


export function useInstallPrompt(): { canInstall: boolean; install: () => Promise<void> } {
  const event = useSyncExternalStore(subscribe, () => deferred, () => null);
  return {
    canInstall: event !== null,
    install: async () => {
      if (!deferred) return;
      const e = deferred;
      deferred = null; 
      emit();
      await e.prompt();
    },
  };
}
