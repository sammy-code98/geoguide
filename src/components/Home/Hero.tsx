import { useState } from 'react'
import { getHeroSectionContent, HomepageTabs, homepageTabs } from './data'
import { BsGlobeAsiaAustralia } from 'react-icons/bs';
import { IoBedOutline, IoFastFood } from "react-icons/io5";
import { GiModernCity } from 'react-icons/gi';
import { TbBeach } from 'react-icons/tb';
import { MdSportsKabaddi } from 'react-icons/md';
import bgImg from "../../assets/bgImg.jpg";


export default function Hero() {
  const [currentTab, setCurrentTab] = useState<HomepageTabs>(HomepageTabs.Country);
  const { title, description } = getHeroSectionContent(currentTab);

  return (
    <section className="relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-8 order-2 lg:order-1">

            <div className="flex flex-wrap gap-2 mb-6">
              {homepageTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${tab === currentTab
                    ? "bg-gradient-to-r from-teal-400 to-blue-500  text-white font-semibold shadow-lg shadow-primary/30"
                    : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-textGray"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
                {title}
              </h1>
              <p className="text-xl text-textGray dark:text-gray-300 leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>

            <div>
              <button className='w-1/2 bg-gradient-to-r from-teal-400 to-blue-500  text-white font-semibold py-3 rounded-xl hover:shadow-xl'>Start Exploring </button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-textGray dark:text-grayish">
                <BsGlobeAsiaAustralia className="text-primary" />
                <span>100+ Countries</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-textGray dark:text-grayish">
                <GiModernCity className="text-primary" />
                <span>2000k+ Cities</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-textGray dark:text-grayish">
                <TbBeach className="text-primary" />
                <span>Best Tourist Attractions</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative rounded-3xl p-8">
                <img className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl"
                  alt='hero-image'
                  src={bgImg}

                />

                <div className="z-50 absolute bottom-2 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <IoBedOutline className="text-primary text-lg" />
                      <span className="text-sm font-medium text-textGray dark:text-grayish">Hotels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoFastFood className="text-primary text-lg" />
                      <span className="text-sm font-medium text-textGray dark:text-grayish">Food</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdSportsKabaddi className="text-primary text-lg" />
                      <span className="text-sm font-medium text-textGray dark:text-grayish">Sports</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className='px-4 py-1 text-xs bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-full'>
                      $45,000,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
