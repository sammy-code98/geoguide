/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdArrowBackIos } from "react-icons/md";
import { getSpecificCountry } from '../../api/index.api';
import { AppRoutes } from '../../types/routes';
import { NumComma } from '../../utils/custom';


export default function DetailsPage() {
  const { code } = useParams()

  const { isLoading, data } = useQuery({
    queryKey: ['getACountry'], queryFn: async () => {
      const fetchedData = await getSpecificCountry(code as string)
      console.log({ fetchedData });

      return fetchedData
    }

  })
  console.log(data, "jeje")
  if (isLoading) return <div>Loading...</div>

  if (Array.isArray(data) && data.length === 1) {
    const country = data[0]
    const currency = Object.values(country?.currencies)
    const lang = country?.languages

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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-40 justify-items-center'>
          <div className='w-full'>
            <img className="rounded-lg  w-full h-fit shadow-md" src={country?.flags.png} />
          </div>

          <div>
            <h5 className="mb-2 text-3xl font-bold tracking-light text-black">{country?.name.common}</h5>

            <div className='py-2 md:py-4 flex justify-between flex-wrap'>
              <div className='space-y-4'>
                <p className="font-normal text-black">Official Name :
                  <span className="text-primary ml-1">{country?.name.official}</span>
                </p>
                <p className="font-normal text-black">Capital :
                  <span className="text-primary ml-1">{country?.capital}</span>
                </p>
                <p className="font-normal text-black">Population :
                  <span className="text-primary ml-1">{NumComma(country?.population)}</span>
                </p>
                <p className="font-normal text-black">Region :
                  <span className="text-primary ml-1">{country?.region}</span>
                </p>
                <p className="font-normal text-black">Sub Region :
                  <span className="text-primary ml-1">{country?.subregion}</span>
                </p>

                <p className="font-normal text-black">Start of Week :
                  <span className="text-primary ml-1 capitalize">{country?.startOfWeek}</span>
                </p>
              </div>

              <div className='space-y-4'>
                <p className="font-normal text-black">Top Level Domain :
                  <span className="text-primary ml-1">{country?.tld}</span>
                </p>
                <p className="font-normal text-black">Currency Name :
                  {currency.map((curr: any) => (
                    <span key={curr.name} className="text-primary ml-1 capitalize">{curr.name}</span>
                  ))}

                </p>
                <p className="font-normal text-black">Currency Symbol :
                  {currency.map((curr: any) => (
                    <span key={curr.symbol} className="text-primary ml-1">{curr.symbol}</span>
                  ))}
                </p>
                <div className='flex'>
                  <p className="font-normal text-black">Langauges :</p>
                  <div className='ml-2'>
                    <ul>
                      {Object.entries(lang).map(([code, name]) => (
                        <li key={code} className='text-primary'>
                          {name as string}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="font-normal text-black">UN Member :
                  {country?.unMember ? (<span className="text-primary ml-1">Yes</span>) : (<span className="text-primary ml-1">No</span>)}
                </p>
              </div>
            </div>


            <div className='py-2'>
              <p className="font-normal text-black">Phone Code (IDD) :
                <span className="text-primary ml-1">{country?.idd?.root}</span>
              </p>
            </div>

            <div className='py-2'>
              <div className='grid grid-cols-2 md:grid-cols-4'>
                  <p className="font-normal text-black">Phone Suffixes :</p>

                <div className='col-span-3'>
                  <div className='grid grid-cols-4 md:grid-cols-12 gap-2 md:-ml-20'>
                    {country?.idd?.suffixes.map((_: string | number, i: Key | null | undefined) => (
                      <div key={i} className="py-1 px-4 text-primary  text-sm text-center">{_}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='py-2'>
              <div className='grid grid-cols-2 md:grid-cols-4'>
                <p className="font-normal text-black">Time Zone :</p>
                <div className='col-span-3'>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:-ml-24">
                    {country?.timezones.map((time: string) => (
                      <div key={time} className="py-1 px-2 text-primary border border-grayLight ml-2 rounded-md text-sm text-center">{time}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='py-4'>
              <div className='flex'>
                <p className="font-normal text-black">Alternative Spellings : </p>
                <div className='ml-2'>
                  {country?.altSpellings.map((alt: string) => (
                    <div key={alt} className='text-primary'>{alt}</div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
}
