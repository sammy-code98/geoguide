export default function AuthLoading(): JSX.Element {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-bg"
      role="status"
      aria-live="polite"
    >
      <span className="text-muted">Loading…</span>
    </div>
  );
}
