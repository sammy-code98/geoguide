import React from 'react'
import { IconType } from 'react-icons';

type DicoveryCardT = {
  Icon: React.ElementType | IconType;
  title: string;
  description: string;
};

export default function DicoveryCard({ 
  Icon,
  title,
  description,
 }: DicoveryCardT) {
  return (
    <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h3 className="font-bold text-xl text-black dark:text-white text-center group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-textGray dark:text-grayish text-center leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
