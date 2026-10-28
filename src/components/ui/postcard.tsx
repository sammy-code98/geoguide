/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type Tone = "sea" | "sand" | "terracotta" | "olive";

export const TONES: Record<Tone, { block: string; ink: string; edge: string; hole: string }> = {
  sea: { block: "bg-sea-soft", ink: "text-sea", edge: "border-sea/40", hole: "--sea-soft" },
  sand: { block: "bg-sand-soft", ink: "text-sand", edge: "border-sand/40", hole: "--sand-soft" },
  terracotta: {
    block: "bg-terracotta-soft",
    ink: "text-terracotta",
    edge: "border-terracotta/40",
    hole: "--terracotta-soft",
  },
  olive: { block: "bg-olive-soft", ink: "text-olive", edge: "border-olive/40", hole: "--olive-soft" },
};

interface StampProps {
  tone: Tone;
  icon: ReactNode;
  label: string;
  backing?: string;
  paper?: string;
  className?: string;
}

export function Stamp({ tone, icon, label, backing, paper = "--surface", className }: StampProps): JSX.Element {
  const t = TONES[tone];
  const hole = `rgb(var(${backing ?? t.hole}))`;
  const sheet = `rgb(var(${paper}))`;
  return (
    <div
      aria-hidden="true"
      className={cn("w-[78px] rotate-3 p-[5px]", className)}
      style={{
        background: `radial-gradient(circle, ${hole} 2.4px, ${sheet} 2.9px) -4px -4px / 8px 8px`,
      }}
    >
      <div
        className={cn("flex h-[82px] flex-col items-center justify-center gap-1.5 border", t.edge, t.ink)}
        style={{ background: sheet }}
      >
        <span className="text-[26px] leading-none">{icon}</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
    </div>
  );
}

/** A circular cancellation mark with wavy lines, as stamped over a postcard. */
export function Postmark({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 80 48" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <circle cx="56" cy="24" r="20" strokeWidth="1.5" />
      <circle cx="56" cy="24" r="15" strokeWidth="1" strokeDasharray="2 3" />
      <path strokeWidth="1.5" d="M0 14 q 6 -4 12 0 t 12 0 t 12 0" />
      <path strokeWidth="1.5" d="M0 24 q 6 -4 12 0 t 12 0 t 12 0" />
      <path strokeWidth="1.5" d="M0 34 q 6 -4 12 0 t 12 0 t 12 0" />
    </svg>
  );
}

/** Flat geometric scene for a tone: a sun, a dashed route, and a landscape. */
export function Scene({ tone, className }: { tone: Tone; className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
      className={cn(TONES[tone].ink, className)}
    >
      <circle cx="232" cy="98" r="34" fill="rgb(var(--sun))" />
      <path
        d="M20 104 Q 110 34 192 86"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
      {tone === "sea" && (
        <g fill="currentColor">
          <path opacity="0.28" d="M0 152 C50 140 100 164 150 152 S250 140 300 152 S400 164 400 152 V240 H0Z" />
          <path opacity="0.5" d="M0 182 C60 170 120 194 180 182 S300 170 360 182 S400 190 400 186 V240 H0Z" />
          <path opacity="0.85" d="M0 212 C70 200 140 224 210 212 S340 200 400 212 V240 H0Z" />
        </g>
      )}
      {tone === "sand" && (
        <g fill="currentColor">
          <path opacity="0.32" d="M0 196 Q 120 120 240 176 T 400 158 V240 H0Z" />
          <path opacity="0.75" d="M0 220 Q 150 166 300 212 T 400 204 V240 H0Z" />
        </g>
      )}
      {tone === "terracotta" && (
        <g fill="currentColor">
          <path opacity="0.32" d="M0 204 Q 100 146 200 192 T 400 174 V240 H0Z" />
          <rect opacity="0.85" x="226" y="138" width="118" height="102" />
          <rect opacity="0.85" x="214" y="128" width="142" height="14" />
          <path d="M262 240 V190 a23 23 0 0 1 46 0 V240Z" fill="rgb(var(--sun))" />
        </g>
      )}
      {tone === "olive" && (
        <g fill="currentColor">
          <path opacity="0.32" d="M0 188 Q 110 132 220 182 T 400 166 V240 H0Z" />
          <path opacity="0.72" d="M0 218 Q 140 172 280 212 T 400 202 V240 H0Z" />
          <rect x="86" y="150" width="5" height="32" />
          <circle cx="88.5" cy="146" r="17" opacity="0.9" />
          <rect x="128" y="162" width="4" height="24" />
          <circle cx="130" cy="158" r="12" opacity="0.9" />
          <rect x="336" y="150" width="5" height="34" />
          <circle cx="338.5" cy="146" r="16" opacity="0.9" />
        </g>
      )}
    </svg>
  );
}

interface PostcardHeaderProps {
  tone: Tone;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  stampLabel: string;
  children?: ReactNode;
  className?: string;
}

export function PostcardHeader({
  tone,
  title,
  subtitle,
  icon,
  stampLabel,
  children,
  className,
}: PostcardHeaderProps): JSX.Element {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-9 sm:px-10 sm:py-12",
        TONES[tone].block,
        className
      )}
    >
      <Scene
        tone={tone}
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[52%] max-w-[440px] md:block"
      />
      <Stamp tone={tone} icon={icon} label={stampLabel} className="absolute right-5 top-5 sm:right-8 sm:top-7" />
      <div className="relative max-w-lg pr-24 md:pr-0">
        <h1 className="font-serif text-3xl font-semibold text-fg sm:text-4xl md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-md text-base text-fg/75 md:text-lg">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
