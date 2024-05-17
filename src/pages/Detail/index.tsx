import React from 'react'
import { Link } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import { AppRoutes } from '../../types/routes';

export default function index() {
  return (
    <div className='px-4 sm:px-12 py-8'>
      <div>
        <Link to={AppRoutes.home}>
          <button className='py-2 px-4 bg-white rounded shadow-sm flex justify-center items-center text-sm font-bold text-black'>
            <MdArrowBackIos className="cursor-pointer text-black text-xl" />
            Back
          </button>
        </Link>
      </div>

      <div className='py-4 md:py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-40 items-center '>
          <div>
            <img className="rounded-t-lg" src="https://nextui.org/images/hero-card-complete.jpeg" />
          </div>

          <div>
            <h5 className="mb-2 text-3xl font-bold tracking-light text-black">Counrty</h5>

            <div className='py-2 md:py-4 flex justify-between flex-wrap'>
              <div className='space-y-4'>
                <p className="font-normal text-black">Native Name :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
                <p className="font-normal text-black">Population :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
                <p className="font-normal text-black">Region :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
                <p className="font-normal text-black">Sub Region :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
                <p className="font-normal text-black">Capital :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
              </div>

              <div className='space-y-4'>
                <p className="font-normal text-black">Top Level Domain :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
                <p className="font-normal text-black">Currency :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
                <p className="font-normal text-black">Langauges :
                  <span className="text-textGray ml-1">loeleoe</span>
                </p>
              </div>
            </div>

            <div className='py-4'>
              <p className="font-normal text-black">Border Countries :
                {[1, 2, 3, 4].map((_, i) => (
                  <span key={i} className='py-1 px-4 border border-grayLight ml-2 rounded-md text-sm text-center cursor-pointer'>country</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
