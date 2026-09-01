import { useState } from 'react'
import { getHeroSectionContent, HomepageTabs, homepageTabs } from './data'
import { BsGlobeAsiaAustralia } from 'react-icons/bs';
import { GiModernCity } from 'react-icons/gi';
import { TbBeach } from 'react-icons/tb';
import bgImg from "../../assets/bgImg.jpg";
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../types/routes';
import { Button } from '../ui/button';
import { cn } from '../../lib/cn';

export default function Hero() {
  const [currentTab, setCurrentTab] = useState<HomepageTabs>(HomepageTabs.Country);
  const { title, description } = getHeroSectionContent(currentTab);
  const navigate = useNavigate()

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
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
                      ? "bg-surface text-fg shadow-xs"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-fg leading-[1.1]">
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
                <BsGlobeAsiaAustralia className="text-primary" aria-hidden="true" />
                <span>100+ countries</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <GiModernCity className="text-primary" aria-hidden="true" />
                <span>Thousands of cities</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <TbBeach className="text-primary" aria-hidden="true" />
                <span>Top attractions</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img
              className="w-full h-[360px] lg:h-[520px] object-cover rounded-xl border border-border"
              alt="A scenic travel destination"
              src={bgImg}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
