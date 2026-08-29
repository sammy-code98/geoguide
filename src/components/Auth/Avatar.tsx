interface AvatarProps {
  photoURL: string | null;
  name: string | null;
  email?: string | null;
  /** Tailwind size classes, e.g. "w-9 h-9". */
  className?: string;
}

function initials(name: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  const chars = parts.length >= 2 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return chars.toUpperCase();
}

/** User avatar — shows the Google photo, falling back to initials. */
export default function Avatar({ photoURL, name, email, className = "w-9 h-9" }: AvatarProps): JSX.Element {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt=""
        referrerPolicy="no-referrer"
        className={`${className} rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${className} rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center font-bold`}
    >
      {initials(name, email)}
    </span>
  );
}
