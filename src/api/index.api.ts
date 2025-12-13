import api from "../utils/axios";

export const getAllCountries = async () => {
  const { data } = await api.get(
    "/all?fields=name,flags,capital,population,region"
  );
  return data;
};

export const getSpecificCountry = async (code: string) => {
  const { data } = await api.get(`/alpha/${code}`);
  return data;
};
