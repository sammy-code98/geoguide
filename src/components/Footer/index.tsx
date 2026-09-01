
export default function Footer() {
  return (
    <section className='bg-bg'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-6">
        <div className='flex justify-between items-center flex-col md:flex-row space-y-2'>
          <p className="text-sm md:text-base text-muted">
            Made with ❤️ and 💡 by{" "}
            <a
              href="https://github.com/sammy-code98"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium text-primary hover:text-primary-hover"
            >
              sammy-code98
            </a>
          </p>

          <p className="text-sm md:text-base text-muted">
            All rights reserved, GeoGuide {new Date().getFullYear()}
          </p>
        </div>
      </div>
      </section>
  )
}
