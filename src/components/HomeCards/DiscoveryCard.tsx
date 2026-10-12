import React from 'react'
import { IconType } from 'react-icons';
import { TONES, type Tone } from '../ui/postcard';
import { cn } from '../../lib/cn';

type DiscoveryCardT = {
  Icon: React.ElementType | IconType;
  title: string;
  description: string;
  tone: Tone;
};

/** A flat, colour-blocked postcard for one feature. */
export default function DiscoveryCard({ Icon, title, description, tone }: DiscoveryCardT) {
  const t = TONES[tone];
  return (
    <div className={cn("rounded-2xl p-7 h-full transition-transform duration-200 ease-out-expo hover:-translate-y-0.5", t.block)}>
      <div className={cn("w-12 h-12 flex items-center justify-center bg-surface rounded-full mb-6", t.ink)}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif font-semibold text-xl text-fg mb-2">{title}</h3>
      <p className="text-fg/75 leading-relaxed">{description}</p>
    </div>
  )
}
