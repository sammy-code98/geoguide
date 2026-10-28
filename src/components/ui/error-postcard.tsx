import type { ReactNode } from "react";
import { PiCloudSlashDuotone } from "react-icons/pi";
import { cn } from "../../lib/cn";
import { Postmark, Scene, Stamp, TONES, type Tone } from "./postcard";

interface ErrorPostcardProps {
  title: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
  stampLabel?: string;
  tone?: Tone;
  size?: "full" | "compact";
  as?: "h1" | "h2" | "h3";
  className?: string;
}


export function ErrorPostcard({
  title,
  message,
  action,
  icon = <PiCloudSlashDuotone />,
  stampLabel = "Returned",
  tone = "terracotta",
  size = "full",
  as: Heading = "h3",
  className,
}: ErrorPostcardProps): JSX.Element {
  const t = TONES[tone];

  if (size === "compact") {
    return (
      <div role="alert" className={cn("flex items-start gap-3 rounded-xl px-4 py-3 text-left", t.block, className)}>
        <span
          className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-lg", t.ink)}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-fg">{title}</p>
          {message && <p className="text-sm text-fg/75">{message}</p>}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn("relative overflow-hidden rounded-2xl px-6 py-9 text-left sm:px-10 sm:py-11", t.block, className)}
    >
      <Scene
        tone={tone}
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[38%] max-w-[380px] opacity-60 md:block"
      />
      <Postmark className="absolute right-[88px] top-9 w-16 text-fg/30 sm:right-[100px] sm:top-11" />
      <Stamp tone={tone} icon={icon} label={stampLabel} className="absolute right-5 top-5 sm:right-8 sm:top-7" />
      <div className="relative pr-28 md:max-w-[58%] md:pr-0">
        <Heading className="font-serif text-2xl font-semibold text-fg sm:text-3xl">{title}</Heading>
        {message && <p className="mt-2 text-fg/75">{message}</p>}
        {action && <div className="mt-6 flex flex-wrap items-center gap-3">{action}</div>}
      </div>
    </div>
  );
}
