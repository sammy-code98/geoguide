import { useNavigate } from 'react-router-dom'
import DiscoveryCard from '../HomeCards/DiscoveryCard'
import { discoverTravelFeaturesData } from './data'
import { AppRoutes } from '../../types/routes'
import { Button } from '../ui/button'

export default function Discover() {
  const navigate = useNavigate()
  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fg">
            Discover all things geography
          </h2>
          <p className="text-lg text-muted">
            Explore comprehensive travel guides designed to help you discover countries,
            learn key details, and plan your trips with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverTravelFeaturesData.map((data, index) => (
            <DiscoveryCard key={index} {...data} />
          ))}
        </div>

        <div className="flex justify-center items-center pt-12">
          <Button size="lg" onClick={() => navigate(AppRoutes.countries)}>
            Discover now
          </Button>
        </div>
      </div>
    </section>
  )
}
