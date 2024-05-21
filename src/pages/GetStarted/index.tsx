import { Link } from 'react-router-dom'
import { AppRoutes } from '../../types/routes'

export default function index(): JSX.Element {
  return (
    <div className='w-full lg:py-12'>
      <div className='mt-12 2xl:mt-24 text-center'>
        <div className='space-y-6 lg:space-y-20'>
          <h3 className='text-textGray text-4xl lg:text-5xl font-bold'>Welcome to </h3>
          <h1 className='text-primary text-5xl lg:text-9xl font-bold antialiased italic'>GeoGuide</h1>
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
      </div>
    </div>
  )
}
