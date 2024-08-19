import api from "../utils/axios";

export const getAllCountries = async () => {
  const { data } = await api.get("/all");
  return data;
};

export const getSpecificCountry = async (code: string) => {
  const { data } = await api.get(`/alpha/${code}`);
  return data;
};
