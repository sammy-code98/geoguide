import { GiSpinningBlades } from "react-icons/gi";

/** Full-screen loading state shown while auth is resolving. */
export default function AuthLoading(): JSX.Element {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-bg"
      role="status"
      aria-live="polite"
    >
      <GiSpinningBlades className="text-5xl text-primary animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
