import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
  PiAirplaneInFlightDuotone,
  PiAirplaneTiltDuotone,
  PiBinocularsDuotone,
  PiCameraDuotone,
  PiCloudDuotone,
  PiCompassDuotone,
  PiGlobeHemisphereWestDuotone,
  PiMapTrifoldDuotone,
  PiMountainsDuotone,
  PiSailboatDuotone,
  PiSuitcaseRollingDuotone,
  PiSunHorizonDuotone,
  PiTentDuotone,
  PiTicketDuotone,
  PiTreePalmDuotone,
} from "react-icons/pi";
import { TONES, type Tone } from "./postcard";

interface Doodle {
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  /** Which side margin it lives in. */
  side: "left" | "right";
  /** 0–1: where across that margin it sits (0 = screen edge). */
  across: number;
  /** Vertical position in viewport percent. */
  y: number;
  size: number;
  tone: Tone;
  rotate: number;
  /** 0–1: how far it shifts with the cursor (nearer = larger). */
  depth: number;
  /** Seconds for one float cycle, and its offset. */
  dur: number;
  delay: number;
  drift: "a" | "b";
}

const DOODLES: Doodle[] = [
  { Icon: PiCloudDuotone, side: "left", across: 0.7, y: 8, size: 56, tone: "sea", rotate: 0, depth: 0.3, dur: 18, delay: -4, drift: "b" },
  { Icon: PiAirplaneTiltDuotone, side: "left", across: 0.15, y: 18, size: 42, tone: "sea", rotate: -12, depth: 0.8, dur: 11, delay: 0, drift: "a" },
  { Icon: PiBinocularsDuotone, side: "left", across: 0.75, y: 32, size: 34, tone: "olive", rotate: -8, depth: 0.65, dur: 13, delay: -10, drift: "b" },
  { Icon: PiSuitcaseRollingDuotone, side: "left", across: 0.3, y: 47, size: 44, tone: "sand", rotate: -6, depth: 0.6, dur: 13, delay: -6, drift: "b" },
  { Icon: PiTicketDuotone, side: "left", across: 0.8, y: 63, size: 36, tone: "olive", rotate: -18, depth: 0.55, dur: 12, delay: -7, drift: "a" },
  { Icon: PiCameraDuotone, side: "left", across: 0.2, y: 78, size: 40, tone: "terracotta", rotate: 12, depth: 0.4, dur: 15, delay: -8, drift: "a" },
  { Icon: PiSailboatDuotone, side: "left", across: 0.65, y: 91, size: 42, tone: "sea", rotate: -4, depth: 0.5, dur: 14, delay: -3, drift: "b" },
  { Icon: PiSunHorizonDuotone, side: "right", across: 0.6, y: 8, size: 48, tone: "sand", rotate: 0, depth: 0.35, dur: 17, delay: -9, drift: "a" },
  { Icon: PiCompassDuotone, side: "right", across: 0.15, y: 22, size: 50, tone: "terracotta", rotate: 10, depth: 0.5, dur: 14, delay: -3, drift: "b" },
  { Icon: PiGlobeHemisphereWestDuotone, side: "right", across: 0.75, y: 37, size: 40, tone: "sand", rotate: 6, depth: 0.45, dur: 15, delay: -1, drift: "b" },
  { Icon: PiTreePalmDuotone, side: "right", across: 0.25, y: 53, size: 54, tone: "olive", rotate: 8, depth: 0.9, dur: 12, delay: -2, drift: "a" },
  { Icon: PiMountainsDuotone, side: "right", across: 0.7, y: 68, size: 50, tone: "terracotta", rotate: 0, depth: 0.4, dur: 19, delay: -6, drift: "a" },
  { Icon: PiMapTrifoldDuotone, side: "right", across: 0.2, y: 83, size: 46, tone: "sea", rotate: -10, depth: 0.7, dur: 16, delay: -5, drift: "b" },
  { Icon: PiTentDuotone, side: "right", across: 0.6, y: 94, size: 38, tone: "olive", rotate: 4, depth: 0.6, dur: 16, delay: -11, drift: "a" },
];

/** Max sideways travel (px): 22 of cursor parallax + 10 of float drift, plus
 *  slack for rotation — reserved so a moving doodle never reaches text. */
const PARALLAX_X = 36;
const EDGE = 6;

/** Width of the empty margin beside the page's content column. */
function measureGutter(contentWidth: number): number {
  const vw = window.innerWidth;
  // Matches the page containers' px-4 / sm:px-6 / lg:px-8 inner padding.
  const pad = vw >= 1024 ? 32 : vw >= 640 ? 24 : 16;
  return Math.max(0, (vw - Math.min(contentWidth, vw)) / 2 + pad);
}

interface TravelBackdropProps {
  /** The current page's content max-width in px (e.g. 1280 for max-w-7xl). */
  contentWidth: number;
}

/**
 * Ambient travel backdrop: flat duotone doodles that float on slow loops,
 * shift with the cursor on depth layers, and a small plane that flies a dashed
 * route across the top. Doodles live only in the page's side margins — each is
 * placed inside the measured gutter and dropped if it can't fit — so they never
 * sit under text. Never takes pointer events; still under reduced motion.
 */
export function TravelBackdrop({ contentWidth }: TravelBackdropProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [gutter, setGutter] = useState(() => measureGutter(contentWidth));

  // Re-measure the margin whenever the viewport or the page's width changes.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setGutter(measureGutter(contentWidth)));
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, [contentWidth]);

  // Cursor parallax: write the pointer position (-1..1) to CSS variables once
  // per frame; each doodle multiplies it by its own depth.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--px", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.22] dark:opacity-[0.16]"
    >
      {/* The flight: a dashed route with a plane travelling along it. */}
      <div className="absolute inset-x-0 top-[11vh] h-[120px] text-sea">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-full w-full" fill="none">
          <path
            d="M0 100 Q 500 -60 1000 100"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="travel-fly-x absolute inset-x-0 bottom-0">
          <div className="travel-fly-y absolute left-0 bottom-0">
            <PiAirplaneInFlightDuotone className="travel-fly-tilt -translate-x-1/2 translate-y-1/2 text-[34px] opacity-0 motion-reduce:hidden" />
          </div>
        </div>
      </div>

      {DOODLES.map(({ Icon, side, across, y, size, tone, rotate, depth, dur, delay, drift }, i) => {
        // Room left in the margin once the icon and its drift are accounted for.
        const room = gutter - size - PARALLAX_X - EDGE;
        if (room < 0) return null;
        const offset = EDGE + across * room;
        return (
          <div
            key={i}
            className={`travel-parallax travel-doodle absolute ${TONES[tone].ink}`}
            style={{ [side]: offset, top: `${y}%`, "--d": depth } as CSSProperties}
          >
            <div
              className={drift === "a" ? "travel-drift-a" : "travel-drift-b"}
              style={{ "--dur": `${dur}s`, "--delay": `${delay}s` } as CSSProperties}
            >
              <Icon className="block" style={{ fontSize: size, transform: `rotate(${rotate}deg)` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
