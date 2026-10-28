import { useState } from 'react'
import { getHeroSectionContent, HomepageTabs, homepageTabs } from './data'
import { BsGlobeAsiaAustralia } from 'react-icons/bs';
import { GiModernCity } from 'react-icons/gi';
import { TbBeach } from 'react-icons/tb';
import { MdOutlineFlight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../types/routes';
import { Button } from '../ui/button';
import { Postmark, Stamp } from '../ui/postcard';
import { SafeImage } from '../ui/safe-image';
import { cn } from '../../lib/cn';
import paris from "../../assets/places/paris.jpg";
import lagos from "../../assets/places/lagos.jpg";
import rome from "../../assets/places/rome.jpg";


function Postcard({ src, place, coords, className, children }: {
  src: string; place: string; coords: string; className?: string; children?: React.ReactNode;
}) {
  return (
    <figure className={cn("absolute bg-surface border border-border p-3", className)}>
      <SafeImage src={src} alt={place} className="aspect-[4/3] w-full object-cover" loading="eager" />
      <figcaption className="flex items-end justify-between gap-3 px-1 pt-3 pb-1">
        <span>
          <span className="block font-serif text-lg font-semibold text-fg leading-tight">{place}</span>
          <span className="block whitespace-nowrap text-[11px] sm:text-xs text-muted tabular-nums">{coords}</span>
        </span>
        {children}
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  const [currentTab, setCurrentTab] = useState<HomepageTabs>(HomepageTabs.Country);
  const { title, description } = getHeroSectionContent(currentTab);
  const navigate = useNavigate()

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-8 order-2 lg:order-1">
            {/* Segmented category selector */}
            <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-surface-2 border border-border">
              {homepageTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    tab === currentTab
                      ? "bg-surface text-fg ring-1 ring-border"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-fg leading-[1.05]">
                {title}
              </h1>
              <p className="text-lg text-muted leading-relaxed max-w-xl">
                {description}
              </p>
            </div>

            <Button size="lg" onClick={() => navigate(AppRoutes.countries)}>
              Start exploring
            </Button>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted">
                <BsGlobeAsiaAustralia className="text-sea" aria-hidden="true" />
                <span>100+ countries</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <GiModernCity className="text-terracotta" aria-hidden="true" />
                <span>Thousands of cities</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <TbBeach className="text-sand" aria-hidden="true" />
                <span>Top attractions</span>
              </div>
            </div>
          </div>

          {/* A stack of postcards from the road */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]" aria-hidden="true">
              <Postcard
                src={lagos}
                place="Lagos"
                coords="6.52° N · 3.38° E"
                className="left-0 top-[4%] w-[52%] -rotate-[7deg]"
              />
              <Postcard
                src={rome}
                place="Rome"
                coords="41.90° N · 12.50° E"
                className="right-[4%] top-0 w-[48%] rotate-[5deg]"
              />
              <Postcard
                src={paris}
                place="Paris"
                coords="48.86° N · 2.35° E"
                className="bottom-0 left-[18%] w-[58%] -rotate-[1.5deg]"
              >
                <span className="relative shrink-0">
                  <Postmark className="absolute -left-12 top-1 w-16 text-fg/40" />
                  <Stamp
                    tone="sea"
                    icon={<MdOutlineFlight />}
                    label="Air mail"
                    paper="--sea-soft"
                    backing="--surface"
                    className="relative w-[64px] [&>div]:h-[68px]"
                  />
                </span>
              </Postcard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
