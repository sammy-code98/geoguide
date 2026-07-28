import aboutUs from "../../assets/places/about.jpg"

export default function About() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                About GeoGuide
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-grey dark:text-white leading-tight">
                Your gateway to exploring the world’s countries, cultures, and attractions.
              </h2>

              <div className="space-y-3 text-lg text-textGray dark:text-grayish  leading-relaxed">
                <p>
                  GeoGuide is your first stop for discovering new countries, planning trips, and learning about destinations across the globe.
                </p>
                <p>
                  With GeoGuide, every trip begins with exploration. Dive into immersive maps, uncover must-visit spots, and plan memorable adventures across countries and cultures.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-primary">100+</h3>
                <p className="text-sm text-textGray dark:text-grayish">
                  Countries
                </p>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-primary">200k+</h3>
                <p className="text-sm text-textGray dark:text-grayish">
                  Cities
                </p>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-primary">1M+</h3>
                <p className="text-sm text-textGray dark:text-grayish">
                  Users
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-3xl p-8">
                <img
                  alt="About us image"
                  src={aboutUs}
                  loading="lazy"
                  className="w-full lg:h-[500px] object-cover rounded-2xl"
                />
                <div className="absolute -top-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">#1</div>
                    <div className="text-xs text-textGray dark:text-grayish font-semibold">
                      Travel Portal
                    </div>
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
