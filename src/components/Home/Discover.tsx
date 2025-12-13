import { useNavigate } from 'react-router-dom'
import DicoveryCard from '../HomeCards/DiscoveryCard'
import { discoverTravelFeaturesData } from './data'
import { AppRoutes } from '../../types/routes'

export default function Discover() {
  const navigate = useNavigate()
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white">
              Discover All Things <span className='bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent  font-bold'>Geography</span> 
            </h2>
            <p className="text-lg text-textGray dark:text-grayish max-w-3xl mx-auto">
              Explore our comprehensive travel guides designed to help you discover countries, learn key details, and plan your trips with confidence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {discoverTravelFeaturesData.map((data,index) => (
            <div key={index}
              className="animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
          >
            <DicoveryCard {...data}/>
          </div>
          ))}
        </div>

        <div className='flex justify-center items-center pt-12'>
          <button
            onClick={() => navigate(AppRoutes.countries)}
            className='w-full md:w-2/6 bg-gradient-to-r from-teal-400 to-blue-500  text-white font-semibold py-3 rounded-xl hover:shadow-xl'>Discover Now</button>
        </div>
      </div>
      </section>
  )
}
