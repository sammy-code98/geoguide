import { HiOutlineCheckCircle } from "react-icons/hi2"
import Expert from "../../assets/places/expert.jpg"
import { Badge } from "../ui/badge"

const FEATURES = ["Travel experts", "Local expertise", "24/7 support", "Best deals"]

export default function Experts() {
  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-1">
            <img
              alt="A local travel expert"
              src={Expert}
              loading="lazy"
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl border border-border"
            />
          </div>
          <div className="order-2 space-y-8">
            <div className="space-y-5">
              <Badge variant="primary">Destination experts</Badge>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-fg leading-tight">
                Connect with reliable travel experts wherever you go
              </h2>

              <p className="text-lg text-muted leading-relaxed">
                Explore a world of destinations, must see landmarks, hidden gems, and
                cultural guides. For expert recommendations and on-the-ground insight,
                connect with our trusted local experts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <HiOutlineCheckCircle className="text-primary text-xl shrink-0" aria-hidden="true" />
                  <span className="text-sm text-muted">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
