import Search from "../../components/Search"
import Filter from "../../components/Filter"
import CountryCard from "../../components/CountryCard"

export default function index() {
  return (
    <div className='px-4 sm:px-12 py-8'>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Search />
        <Filter />
      </div>

      <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12 justify-items-center">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <CountryCard key={index} />
        ))}
      </div>
    </div>
  )
}
