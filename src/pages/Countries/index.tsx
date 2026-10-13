import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { getCountries } from "../../api/index.api";
import type { Country } from "../../types/country";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import CardLoader from "../../components/CountryCard/cardLoader";
import CountryCard from "../../components/CountryCard";
import { EmptyState } from "../../components/ui/empty-state";
import { BackToTop } from "../../components/ui/back-to-top";
import { PostcardHeader } from "../../components/ui/postcard";
import { ErrorPostcard } from "../../components/ui/error-postcard";
import { Button } from "../../components/ui/button";
import { NumComma, shortenString } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";

export default function CountriesPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
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
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pt-40">
          <ErrorPostcard
            as="h1"
            title="We couldn't load the countries"
            message={error.message}
            action={
              <Button onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? "Trying…" : "Try again"}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pt-32">
      <PostcardHeader
        tone="sea"
        title="Explore countries"
        subtitle="Browse every destination on the map, then dive into details, weather, and travel tips."
        icon={<HiOutlineGlobeAlt />}
        stampLabel="World"
        className="mb-8"
      />
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Search value={searchQuery} onChange={handleSearchChange} />
        <Filter
          onRegionChange={handleRegionChange}
          value={selectedRegion === "" ? "All" : selectedRegion}
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? "Loading countries…"
          : `${filteredCountries.length} ${
              filteredCountries.length === 1 ? "country" : "countries"
            } found`}
      </p>

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
        <EmptyState
          icon={<HiOutlineGlobeAlt />}
          title="No countries found"
          description="Try a different name, capital, or region."
        />
      )}
    </div>
      <BackToTop />
    </div>
  );
}
