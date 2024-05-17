import api from "../utils/axios";

export const getAllCountries = async (): Promise<unknown> => {
  const { data } = await api.get("/all");
  return data;
};
