import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailLoader from "./detailLoader";
import { MdArrowBackIos } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { HiOutlineCalculator } from "react-icons/hi";
import { getCountryByCode } from "../../api/index.api";
import { AppRoutes } from "../../types/routes";
import { NumComma } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";
import CountryInsights from "../../components/CountryInsights";
import PlaceDiscovery from "../../components/Places/PlaceDiscovery";
import { useCountryInsights } from "../../hooks/useCountryInsights";

export default function DetailsPage() {
  const { code } = useParams();
  const [showInsights, setShowInsights] = useState<boolean>(false);

  const { isLoading, isError, data: country } = useQuery({
    queryKey: [QueryKey.getACountry, code],
    queryFn: () => getCountryByCode(code as string),
    enabled: Boolean(code),
  });

  // AI insights are fetched lazily — only once the traveler asks for them.
  const insights = useCountryInsights(code, showInsights);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 py-24 md:py-36">
          <DetailLoader />
        </div>
      </div>
    );

  if (isError || !country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-screen space-y-6">
          <h1 className="text-8xl font-bold text-primary italic text-center">Oops!</h1>
          <p className="text-center text-textGray dark:text-textWhite text-xl">
            We couldn't find details for this country.
          </p>
          <Link to={AppRoutes.countries}>
            <button className="py-2 px-4 bg-white dark:bg-bgDark rounded shadow-sm flex justify-center items-center text-sm font-bold text-black dark:text-textWhite">
              <MdArrowBackIos />
              Back to countries
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 py-24 md:py-36">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link to={AppRoutes.countries}>
            <button className="py-2 px-4 bg-white dark:bg-bgDark rounded shadow-sm flex justify-center items-center text-sm font-bold text-black dark:text-textWhite">
              <MdArrowBackIos />
              Back
            </button>
          </Link>
          <Link
            to={`${AppRoutes.costEstimator}?destination=${encodeURIComponent(country.name)}`}
          >
            <button className="py-2 px-4 rounded shadow-sm flex items-center gap-1 text-sm font-bold text-primary bg-white dark:bg-bgDark hover:opacity-90">
              <HiOutlineCalculator />
              Estimate trip cost
            </button>
          </Link>
        </div>

        <div className="py-4 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-20 justify-items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative h-[400px]  lg:h-[500px] bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-3xl p-8">
                <img
                  alt={`${country.name}'s flag`}
                  src={country.flagPng}
                  className="w-full h-[400px]- h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-3xl font-bold tracking-light text-black dark:text-textWhite">
                {country.name}
              </h5>

              <div className="py-2 md:py-4 flex justify-between flex-wrap">
                <div className="space-y-4">
                  {country.nativeName && (
                    <p className="font-normal text-black dark:text-textWhite">
                      Native Name :
                      <span className="text-primary ml-1 font-medium">
                        {country.nativeName}
                      </span>
                    </p>
                  )}
                  <p className="font-normal text-black dark:text-textWhite">
                    Capital :
                    <span className="text-primary ml-1 font-medium">
                      {country.capital ?? "—"}
                    </span>
                  </p>
                  <p className="font-normal text-black dark:text-textWhite ">
                    Population :
                    <span className="text-primary ml-1 font-medium">
                      {NumComma(country.population)}
                    </span>
                  </p>
                  <p className="font-normal text-black dark:text-textWhite">
                    Region :
                    <span className="text-primary ml-1 font-medium">
                      {country.region}
                    </span>
                  </p>
                  <p className="font-normal text-black dark:text-textWhite">
                    Sub Region :
                    <span className="text-primary ml-1 font-medium">
                      {country.subregion ?? "—"}
                    </span>
                  </p>
                  <p className="font-normal text-black dark:text-textWhite">
                    Independent :
                    <span className="text-primary ml-1 font-medium">
                      {country.independent ? "Yes" : "No"}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="font-normal text-black dark:text-textWhite">
                    Top Level Domain :
                    <span className="text-primary ml-1 font-medium">
                      {country.topLevelDomains.join(", ") || "—"}
                    </span>
                  </p>
                  <p className="font-normal text-black dark:text-textWhite">
                    Currency Name :
                    {country.currencies.map((curr) => (
                      <span
                        key={curr.code || curr.name}
                        className="text-primary ml-1 capitalize font-medium"
                      >
                        {curr.name}
                      </span>
                    ))}
                  </p>
                  <p className="font-normal text-black dark:text-textWhite">
                    Currency Symbol :
                    {country.currencies.map((curr) => (
                      <span
                        key={curr.code || curr.symbol}
                        className="text-primary ml-1 font-medium"
                      >
                        {curr.symbol}
                      </span>
                    ))}
                  </p>
                  <div className="flex">
                    <p className="font-normal text-black dark:text-textWhite">
                      Languages :
                    </p>
                    <div className="ml-2">
                      <ul>
                        {country.languages.map((language) => (
                          <li key={language} className="text-primary font-medium">
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="font-normal text-black dark:text-textWhite">
                    Calling Code :
                    <span className="text-primary ml-1 font-medium">
                      {country.callingCodes.map((c) => `+${c}`).join(", ") || "—"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="py-2">
                <div className="flex  items-center gap-4">
                  <p className="font-normal text-black dark:text-textWhite">
                    Time Zone :
                  </p>
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {country.timezones.map((time) => (
                        <div
                          key={time}
                          className="py-1 px-2 text-primary font-medium border border-grayLight ml-2 rounded-md text-sm text-center"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {country.altSpellings.length > 0 && (
                <div className="py-4">
                  <div className="flex">
                    <p className="font-normal text-black dark:text-textWhite">
                      Alternative Spellings :{" "}
                    </p>
                    <div className="ml-2">
                      {country.altSpellings.map((alt) => (
                        <div key={alt} className="text-primary font-medium">
                          {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Travel Insights (Gemini) */}
        <section className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-textWhite flex items-center gap-2">
                <HiSparkles className="text-primary" />
                AI Travel Insights
              </h2>
              <p className="text-textGray dark:text-grayish mt-1">
                Explore {country.name} with AI-generated travel guidance.
                <span className="ml-1 text-sm">Powered by Gemini.</span>
              </p>
            </div>
            {showInsights ? (
              <button
                onClick={() => insights.refetch()}
                disabled={insights.isFetching}
                className="self-start md:self-auto py-2.5 px-5 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
              >
                {insights.isFetching ? "Regenerating…" : "Regenerate"}
              </button>
            ) : (
              <button
                onClick={() => setShowInsights(true)}
                className="self-start md:self-auto inline-flex items-center gap-2 py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <HiSparkles />
                Find out more about {country.name}
              </button>
            )}
          </div>

          {showInsights && (
            <div className="pt-8">
              <CountryInsights
                data={insights.data}
                isLoading={insights.isLoading}
                isError={insights.isError}
                error={insights.error as Error | null}
                onRetry={() => insights.refetch()}
              />
            </div>
          )}
        </section>

        {/* Place discovery (Serpstack) */}
        <PlaceDiscovery
          country={{ name: country.name, capital: country.capital, cca2: country.cca2 }}
        />
      </div>
    </div>
  );
}
