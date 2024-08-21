import { ChangeEvent, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "../../api/index.api";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import CardLoader from "../../components/CountryCard/cardLoader";
import CountryCard from "../../components/CountryCard";
import { NumComma, shortenString } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";

interface CountryI {
  name: { common: string };
  population: number;
  region: string;
  capital: string;
  flags: { png: string; alt: string };
  cca3: string;
}
export default function HomePage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKey.getCountries],
    queryFn: getAllCountries,
  });

  let filteredCountries = data;

  if (searchQuery) {
    filteredCountries = filteredCountries?.filter((country: CountryI) => {
      const name = country.name.common.toLowerCase();
      const capital =
        country.capital && country.capital[0]
          ? country.capital[0].toLowerCase()
          : "";

      const searchQueryLower = searchQuery.toLowerCase();
      return (
        name.includes(searchQueryLower) || capital.includes(searchQueryLower)
      );
    });
  }

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event) {
        setSearchQuery(event.target.value);
      } else {
        setSearchQuery("");
      }
    },
    []
  );

  if (selectedRegion) {
    filteredCountries = filteredCountries?.filter((country: CountryI) => {
      return country.region === selectedRegion;
    });
  }

  const handleRegionChange = (region: string) => {
    if (region === "All") {
      setSelectedRegion("");
    } else {
      setSelectedRegion(region);
    }
  };

  if (isError) {
    return (
      <div className="flex justify-center items-center px-4 dark:bg-bgDark h-screen">
        <div className="flex flex-col justify-center  items-center ">
          <div className="space-y-6">
            <h1 className="text-8xl font-bold text-primary italic text-center">
              Oops!
            </h1>
            <p className="text-center text-textGray dark:text-textWhite text-xl">
              GeoGuide encounterd a{" "}
              <span className="font-bold ">{error.message}</span> while fetching
              countries
            </p>
            <p className="text-center text-textGray dark:text-textWhite text-xl">
              Check your internet connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-12 py-4 dark:bg-bgDark">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Search value={searchQuery} onChange={handleSearchChange} />
        <Filter
          onRegionChange={handleRegionChange}
          value={selectedRegion === "" ? "All" : selectedRegion}
        />
      </div>

      <div className="py-12 md:py-16 lg:py-20 xl:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 lg:gap-12 xl:gap-16 justify-items-center">
        {isLoading ? (
          Array(10).fill(<CardLoader />)
        ) : (
          <>
            {filteredCountries?.map((country: CountryI) => (
              <CountryCard
                key={country.name.common}
                name={shortenString(country.name.common) || "____"}
                population={NumComma(country.population) || 0}
                region={country.region || "____"}
                capital={country.capital || "____"}
                img={country.flags.png}
                alt={country.flags.alt || `${country.name.common}'s flag`}
                code={country.cca3}
              />
            ))}
          </>
        )}
      </div>
      {filteredCountries?.length === 0 && (
        <div className="flex justify-center items-center">
          <p className="text-center text-textGray text-xl">
            No countries found matching your search query. Try searching for a
            different country or capital.
          </p>
        </div>
      )}
    </div>
  );
}
