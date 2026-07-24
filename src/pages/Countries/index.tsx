import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../../api/index.api";
import type { Country } from "../../types/country";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import CardLoader from "../../components/CountryCard/cardLoader";
import CountryCard from "../../components/CountryCard";
import { NumComma, shortenString } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";

export default function CountriesPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKey.getCountries],
    queryFn: getCountries,
  });

  const filteredCountries = useMemo(() => {
    let result: Country[] = data ?? [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((country) => {
        const name = country.name.toLowerCase();
        const capital = country.capital?.toLowerCase() ?? "";
        return name.includes(q) || capital.includes(q);
      });
    }

    if (selectedRegion) {
      result = result.filter((country) => country.region === selectedRegion);
    }

    return result;
  }, [data, searchQuery, selectedRegion]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event?.target?.value ?? "");
    },
    []
  );

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
              GeoGuide encountered a{" "}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 py-24 md:py-36">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Search value={searchQuery} onChange={handleSearchChange} />
        <Filter
          onRegionChange={handleRegionChange}
          value={selectedRegion === "" ? "All" : selectedRegion}
        />
      </div>

        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full">
        {isLoading ? (
            new Array(9).fill(null).map((_, index) => <CardLoader key={index} />)
        ) : (
          <>
            {filteredCountries.map((country) => (
              <CountryCard
                key={country.cca3 || country.name}
                code={country.cca3}
                name={shortenString(country.name) || "____"}
                population={NumComma(country.population) || 0}
                region={country.region || "____"}
                capital={country.capital || "____"}
                img={country.flagPng}
                alt={`${country.name}'s flag`}
              />
            ))}
          </>
        )}
      </div>
      {filteredCountries.length === 0 && !isLoading && (
        <div className="flex justify-center items-center">
          <p className="text-center text-textGray text-xl">
            No countries found matching your search query. Try searching for a
            different country or capital.
          </p>
        </div>
      )}
    </div>
    </div>
  );
}
