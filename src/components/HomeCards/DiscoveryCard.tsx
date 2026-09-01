import React from 'react'
import { IconType } from 'react-icons';

type DiscoveryCardT = {
  Icon: React.ElementType | IconType;
  title: string;
  description: string;
};

export default function DiscoveryCard({ Icon, title, description }: DiscoveryCardT) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 h-full transition-colors hover:border-primary/40">
      <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-lg mb-5">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg text-fg mb-2">{title}</h3>
      <p className="text-muted leading-relaxed">{description}</p>
    </div>
  )
}
