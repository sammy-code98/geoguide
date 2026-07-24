import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailLoader from "./detailLoader";
import { MdArrowBackIos } from "react-icons/md";
import { getCountryByCode } from "../../api/index.api";
import { AppRoutes } from "../../types/routes";
import { NumComma } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";
import Modal from "../../components/Modal";
import { CohereClient } from "cohere-ai";
import { GiSpinningBlades } from "react-icons/gi";

export default function DetailsPage() {
  const { code } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [cohereResponse, setCohereResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_TOKEN,
  });

  const { isLoading, isError, data: country } = useQuery({
    queryKey: [QueryKey.getACountry, code],
    queryFn: () => getCountryByCode(code as string),
    enabled: Boolean(code),
  });

  useEffect(() => {
    if (open && country?.name) {
      setIsAiLoading(true);

      (async () => {
        const chat = await cohere.chat({
          model: "command",
          message: `Get to know the essence of ${country.name}! What are the key cultural customs, historical moments, and local experiences that give this country its unique character?`,
        });
        setCohereResponse(chat.text);
        setIsAiLoading(false);
      })();
    } else {
      setIsAiLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, country]);

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 py-24 md:py-36">
          <div>
            <Link to={AppRoutes.countries}>
              <button className="py-2 px-4 bg-white dark:bg-bgDark rounded shadow-sm flex justify-center items-center text-sm font-bold text-black dark:text-textWhite">
                <MdArrowBackIos />
                Back
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

          <div className="py-4 flex justify-center items-center">
            <button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-semibold">
                Find out more about {country.name}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal
        onClose={() => setOpen(false)}
        open={open}
        country={country.name}
      >
        {isAiLoading ? (
          <div className="py-6 flex justify-center items-center h-[50vh]">
            <GiSpinningBlades className="text-6xl text-primary animate-spin" />
          </div>
        ) : cohereResponse ? (
          <div>
            <p className="font-normal text-black dark:text-textWhite">
              {cohereResponse}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
