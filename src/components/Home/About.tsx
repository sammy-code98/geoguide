import aboutUs from "../../assets/places/about.jpg"
import { Badge } from "../ui/badge"

export default function About() {
  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-5">
              <Badge variant="primary">About GeoGuide</Badge>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-fg leading-tight">
                Your gateway to exploring the world’s countries, cultures, and attractions.
              </h2>

              <div className="space-y-3 text-lg text-muted leading-relaxed">
                <p>
                  GeoGuide is your first stop for discovering new countries, planning trips,
                  and learning about destinations across the globe.
                </p>
                <p>
                  Every trip begins with exploration. Dive into maps, uncover must-visit
                  spots, and plan memorable adventures across countries and cultures.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2">
              {[
                { stat: "100+", label: "Countries" },
                { stat: "200k+", label: "Cities" },
                { stat: "1M+", label: "Travelers" },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <h3 className="font-serif text-3xl font-semibold text-primary">{s.stat}</h3>
                  <p className="text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img
              alt="Travelers exploring a destination"
              src={aboutUs}
              loading="lazy"
              className="w-full lg:h-[500px] object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
