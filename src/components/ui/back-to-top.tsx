import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi2";
import { cn } from "../../lib/cn";

interface BackToTopProps {
  /** Scroll distance (px) after which the button appears. */
  threshold?: number;
  className?: string;
}

/**
 * Floating "back to top" control. Fades in once the page is scrolled past
 * `threshold`, and jumps to the top on click (smooth unless the user prefers
 * reduced motion). Fixed to the bottom-right corner.
 */
export function BackToTop({ threshold = 400, className }: BackToTopProps): JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full flex items-center justify-center",
        "bg-primary text-primary-foreground shadow-card hover:bg-primary-hover",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        className
      )}
    >
      <HiArrowUp className="text-xl" aria-hidden="true" />
    </button>
  );
}
