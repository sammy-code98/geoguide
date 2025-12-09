// import { Link } from 'react-router-dom'
// import { AppRoutes } from '../../types/routes'
import Advice from '../../components/Home/Advice'
import Discover from '../../components/Home/Discover'
import Hero from '../../components/Home/Hero'

export default function index(): JSX.Element {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800"
    >

      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
        <Discover />
        <Advice />
      </div>
      {/* <div className='mt-12- 2xl:mt-24- text-center'>
        <div className='space-y-6 lg:space-y-20'>
          <h3 className='text-textGray text-4xl lg:text-5xl font-bold'>Welcome to </h3>
          <h1 className='bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-5xl lg:text-9xl font-bold antialiased italic'>GeoGuide</h1>
        </div>
        <div className='lg:px-12 mt-4'>
          <p className='text-lg text-center text-textGray'>Looking for the right information about your next tourist destination? Look no further, GeoGuide got you covered.</p>
        </div>

        <div className='py-8'>
          <Link to={AppRoutes.home}>
            <button className='bg-primary text-white font-bold px-8 py-2 rounded hover:opacity-50'>Start Exploring</button>
          </Link>
        </div>
      </div>
      <div className='absolute bottom-0 right-0 px-4'>
        <p className="text-textGray text-sm md:text-base">
          All rights reserved, GeoGuide {new Date().getFullYear()}
        </p>
      </div> */}
    </div>
  )
}
