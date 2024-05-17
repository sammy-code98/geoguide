import api from "../utils/axios";

export const getAllCountries = async () => {
  const { data } = await api.get("/all");
  return data;
};
