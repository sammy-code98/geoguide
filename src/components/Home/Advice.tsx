import { useNavigate } from 'react-router-dom'
import PlaceCard from '../HomeCards/PlaceCard'
import { placesData } from './data'
import { AppRoutes } from '../../types/routes'

export default function Advice() {
  const navigate = useNavigate()
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-black dark:text-textWhite">
              Global Travel Insights & Cultural Knowledge
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight">
              Discover the World with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-600 to-green-700 font-bold">
                GeoGuide
              </span>
            </h2>

            <p className="text-lg text-textGray dark:text-grayish max-w-4xl mx-auto leading-relaxed">
              Get professional insights and expert guidance to make confident
              property decisions with our comprehensive advice from industry
              professionals.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {placesData.map((places) => (
          <div key={places.title} className="group" style={{ animationDelay: "0ms" }}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden">
              <PlaceCard title={places.title} description={places.description} imageUrl={places.imageUrl} />
            </div>
          </div>
        ))}
      </div>

      <div className='mt-20 flex justify-center items-center'>
        <button
          onClick={() => navigate(AppRoutes.countries)}
          className="group relative px-10 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-xl transition-all duration-300  transform hover:-translate-y-1 hover:scale-105"
        >
          <span className="relative z-10 flex items-center gap-3 text-sm md:text-base">
            Explore All Travel Destinations
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </section>
  )
}
