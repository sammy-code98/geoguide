/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailLoader from "./detailLoader";
import { MdArrowBackIos } from "react-icons/md";
import { getChatGptResponse, getSpecificCountry } from "../../api/index.api";
import { AppRoutes } from "../../types/routes";
import { NumComma } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";
import Modal from "../../components/Modal";
import { CohereClient } from "cohere-ai";
import { GiSpinningBlades } from "react-icons/gi";


export default function DetailsPage() {
  const { code } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [cohereResponse, setCohereResponse] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_TOKEN,
  });

  const { isLoading, data } = useQuery({
    queryKey: [QueryKey.getACountry],
    queryFn: async () => {
      const fetchedData = await getSpecificCountry(code as string);
      return fetchedData;
    },
  });

  let country: { name: { common: any } } | any;

  if (Array.isArray(data) && data.length === 1) {
    country = data[0];
  }

  //   (async () => {
  //     const chat = await cohere.chat({
  //         model: "command",
  //         message: `Tell me about ${country?.name.common}`,
  //     });

  //     console.log(chat);
  // })();
  // if (open && country?.name.common) {
  //   (async () => {
  //     const chat = await cohere.chat({
  //       model: "command",
  //       message: `Tell me about ${country?.name.common}`,
  //     });
  //     setCohereResponse(chat.text);

  //     console.log(chat);
  //   })();
  // }
  useEffect(() => {
    if (open && country?.name.common) {
      setIsAiLoading(true);

      (async () => {
        const chat = await cohere.chat({
          model: "command",
          message: `What are the top tourist attractions in  ${country?.name.common} ?`,
        });
        setCohereResponse(chat.text);
        setIsAiLoading(false);
      })();
    } else {
      setIsAiLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, country]);

  // const { data: gptData, isLoading: gptIsLoading } = useQuery({
  //   queryKey: [QueryKey.chatGpt, country?.name.common],
  //   queryFn: async () => {
  //     if (!country) return null;
  //     const gptResponseData = await getChatGptResponse(country?.name.common);
  //     return gptResponseData;
  //   },
  //   enabled: open,
  // });

  // console.log({ gptData });

  if (isLoading)
    return (
      <>
        <DetailLoader />
      </>
    );

  if (Array.isArray(data) && data.length === 1) {
    const country = data[0];
    const currency = Object.values(country?.currencies);
    const lang = country?.languages;

    return (
      <>
        <div className="px-4 sm:px-12 py-8 dark:bg-bgDark h-full">
          <div>
            <Link to={AppRoutes.home}>
              <button className="py-2 px-4 bg-white dark:bg-bgDark rounded shadow-sm flex justify-center items-center text-sm font-bold text-black dark:text-textWhite">
                <MdArrowBackIos />
                Back
              </button>
            </Link>
          </div>

          <div className="py-4 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-40 justify-items-center">
              <div className="w-full">
                <img
                  className="rounded-lg  w-full h-fit shadow-md"
                  src={country?.flags.png}
                />
              </div>

              <div>
                <h5 className="mb-2 text-3xl font-bold tracking-light text-black dark:text-textWhite">
                  {country?.name.common}
                </h5>

                <div className="py-2 md:py-4 flex justify-between flex-wrap">
                  <div className="space-y-4">
                    <p className="font-normal text-black dark:text-textWhite">
                      Official Name :
                      <span className="text-primary ml-1 font-medium">
                        {country?.name.official}
                      </span>
                    </p>
                    <p className="font-normal text-black dark:text-textWhite">
                      Capital :
                      <span className="text-primary ml-1 font-medium">
                        {country?.capital}
                      </span>
                    </p>
                    <p className="font-normal text-black dark:text-textWhite ">
                      Population :
                      <span className="text-primary ml-1 font-medium">
                        {NumComma(country?.population)}
                      </span>
                    </p>
                    <p className="font-normal text-black dark:text-textWhite">
                      Region :
                      <span className="text-primary ml-1 font-medium">
                        {country?.region}
                      </span>
                    </p>
                    <p className="font-normal text-black dark:text-textWhite">
                      Sub Region :
                      <span className="text-primary ml-1 font-medium">
                        {country?.subregion}
                      </span>
                    </p>

                    <p className="font-normal text-black dark:text-textWhite">
                      Start of Week :
                      <span className="text-primary ml-1 capitalize font-medium">
                        {country?.startOfWeek}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="font-normal text-black dark:text-textWhite">
                      Top Level Domain :
                      <span className="text-primary ml-1 font-medium">
                        {country?.tld}
                      </span>
                    </p>
                    <p className="font-normal text-black dark:text-textWhite">
                      Currency Name :
                      {currency.map((curr: any) => (
                        <span
                          key={curr.name}
                          className="text-primary ml-1 capitalize font-medium"
                        >
                          {curr.name}
                        </span>
                      ))}
                    </p>
                    <p className="font-normal text-black dark:text-textWhite">
                      Currency Symbol :
                      {currency.map((curr: any) => (
                        <span
                          key={curr.symbol}
                          className="text-primary ml-1 font-medium"
                        >
                          {curr.symbol}
                        </span>
                      ))}
                    </p>
                    <div className="flex">
                      <p className="font-normal text-black dark:text-textWhite">
                        Langauges :
                      </p>
                      <div className="ml-2">
                        <ul>
                          {Object.entries(lang).map(([code, name]) => (
                            <li key={code} className="text-primary font-medium">
                              {name as string}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <p className="font-normal text-black dark:text-textWhite">
                      UN Member :
                      {country?.unMember ? (
                        <span className="text-primary ml-1 font-medium">
                          Yes
                        </span>
                      ) : (
                        <span className="text-primary ml-1 font-medium">
                          No
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="py-2">
                  <p className="font-normal text-black dark:text-textWhite">
                    Phone Code (IDD) :
                    <span className="text-primary ml-1 font-medium">
                      {country?.idd?.root}
                    </span>
                  </p>
                </div>
                <div className="py-2">
                  <div className="flex justify-between  gap-4  md:gap-10">
                    <p className="font-normal text-black dark:text-textWhite">
                      Phone Suffixes :
                    </p>
                    <div>
                      <div className="grid grid-cols-4 md:grid-cols-12 gap-2 md:-ml-12">
                        {country?.idd?.suffixes.map(
                          (_: string | number, i: Key | null | undefined) => (
                            <div
                              key={i}
                              className="py-1 px-4 text-primary text-sm font-medium"
                            >
                              {_}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <div className="flex  items-center gap-4">
                    <p className="font-normal text-black dark:text-textWhite">
                      Time Zone :
                    </p>
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {country?.timezones.map((time: string) => (
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
                <div className="py-4">
                  <div className="flex">
                    <p className="font-normal text-black dark:text-textWhite">
                      Alternative Spellings :{" "}
                    </p>
                    <div className="ml-2">
                      {country?.altSpellings.map((alt: string) => (
                        <div key={alt} className="text-primary font-medium">
                          {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4 flex justify-center items-center">
            <button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-semibold">
                Find out more about {country?.name.common}
              </span>
            </button>
          </div>
        </div>

        {/* modal */}
        <Modal
          onClose={() => setOpen(false)}
          open={open}
          country={country?.name.common}
        >
          {isAiLoading ? (
            <div className="py-6 flex justify-center items-center h-[50vh]">
              <GiSpinningBlades className="text-4xl text-primary animate-spin"/>
            </div>
          ) :  cohereResponse ?  (
            <div>
               <p className="font-normal text-black dark:text-textWhite">
              {cohereResponse}
            </p>
            </div>
          ): null}
         
        </Modal>
      </>
    );
  }
}
