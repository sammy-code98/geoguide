import { useQuery } from "@tanstack/react-query"
import { getAllCountries } from "../../api/index.api"
import Search from "../../components/Search"
import Filter from "../../components/Filter"
import CardLoader from "../../components/CountryCard/cardLoader"
import CountryCard from "../../components/CountryCard"
import { NumComma, shortenString } from "../../utils/custom"

export default function HomePage(): JSX.Element | string {
  const { isLoading, isError, data, error } = useQuery({ queryKey: ['getCountries'], queryFn: getAllCountries })

  if (isError) {
    return (
      <div className="px-4 py-12">
        <div className="flex flex-col justify-center  items-center ">
          <div className="space-y-6">
            <h1 className="text-8xl font-bold text-primary italic text-center">Oops!</h1>
            <p className="text-center text-textGray text-xl">GeoGuide encounterd a <span className="font-bold ">{error.message}</span> while fetching countries</p>
            <p className="text-center text-textGray text-xl">Check your internet connection and try again.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 sm:px-12 py-8'>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Search />
        <Filter />
      </div>

      <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12 justify-items-center">
        {isLoading ? (Array(10).fill(<CardLoader />)) : (
          <>
            {data?.map((country: { name: { common: string }; population: number; region: string; capital: string; flags: { png: string; alt: string }; cca3: string; }) => (
              <CountryCard key={country.name.common}
                name={shortenString(country.name.common) || '____'}
                population={NumComma(country.population) || 0}
                region={country.region || '____'}
                capital={country.capital || '____'}
                img={country.flags.png}
                alt={country.flags.alt || `${country.name.common}'s flag`}
                code={country.cca3}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
