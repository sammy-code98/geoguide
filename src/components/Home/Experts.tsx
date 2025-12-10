import Expert from "../../assets/places/expert.jpg"

export default function Experts() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-3xl p-8">
                <img
                  alt="experts"
                  src={Expert}
                  className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl"
                />

                <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      500+
                    </div>
                    <div className="text-xs text-textGray dark:text-grayish">
                      Trusted Experts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-secondary rounded-full animate-ping"></span>
                Destination Experts
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight">
                Connect with reliable Travel Experts wherever you go
              </h2>

              <div className="space-y-4 text-lg text-textGray dark:text-grayish leading-relaxed">
                <p>
                  Discover your next adventure on GeoGuide. Explore a world of destinations, must-see landmarks, hidden gems, and cultural guides. For expert recommendations and on-the-ground insights, connect with our trusted Local Experts.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-textGray dark:text-grayish">
                  Travel Experts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-textGray dark:text-grayish">
                  Local Expertise
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-textGray dark:text-grayish">
                  24/7 Support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-textGray dark:text-grayish">
                  Best Deals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
