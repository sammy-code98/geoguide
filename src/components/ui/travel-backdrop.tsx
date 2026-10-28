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
  side: "left" | "right";
  across: number;
  y: number;
  size: number;
  tone: Tone;
  rotate: number;
  depth: number;
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


const PARALLAX_X = 36;
const EDGE = 6;

function measureGutter(contentWidth: number): number {
  const vw = window.innerWidth;
  const pad = vw >= 1024 ? 32 : vw >= 640 ? 24 : 16;
  return Math.max(0, (vw - Math.min(contentWidth, vw)) / 2 + pad);
}

interface TravelBackdropProps {
  contentWidth: number;
}


export function TravelBackdrop({ contentWidth }: TravelBackdropProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [gutter, setGutter] = useState(() => measureGutter(contentWidth));

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
