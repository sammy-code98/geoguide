
export default function Footer() {
  return (
    <section className='bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-6">
        <div className='flex justify-between items-center flex-col md:flex-row space-y-2'>
          <p className="text-sm md:text-lg text-textGray">
            Made with <span className="animate-pulse">❤️</span> and <span className="animate-pulse">💡</span> by{" "}
            <span>
              <a
                href="https://github.com/sammy-code98"
                target="_blank"
                className="underline font-medium bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent"
              >
                sammy-code98
              </a>
            </span>
          </p>

          <p className="text-sm md:text-lg text-textGray dark:text-grayish">
            All rights reserved, GeoGuide {new Date().getFullYear()}
          </p>
        </div>
      </div>
      </section>
  )
}
