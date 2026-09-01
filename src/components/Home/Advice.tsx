import { useNavigate } from 'react-router-dom'
import PlaceCard from '../HomeCards/PlaceCard'
import { placesData } from './data'
import { AppRoutes } from '../../types/routes'
import { Button } from '../ui/button'

export default function Advice() {
  const navigate = useNavigate()
  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-fg">
            Popular destinations
          </h2>
          <p className="text-lg text-muted">
            Get grounded travel insight and cultural context for destinations around the
            world; so every trip starts with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {placesData.map((places) => (
            <PlaceCard
              key={places.title}
              title={places.title}
              description={places.description}
              imageUrl={places.imageUrl}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center items-center">
          <Button size="lg" onClick={() => navigate(AppRoutes.countries)}>
            Explore all destinations
          </Button>
        </div>
      </div>
    </section>
  )
}
