import axios from "axios";
import api from "../utils/axios";

const gptKey = import.meta.env.VITE_GPT_API_KEY;
const gptUrl = import.meta.env.VITE_GPT_URL;

export const getAllCountries = async () => {
  const { data } = await api.get("/all");
  return data;
};

export const getSpecificCountry = async (code: string) => {
  const { data } = await api.get(`/alpha/${code}`);
  return data;
};

export const getChatGptResponse = async (countryName: string) => {
  const response = await axios.post(
    `${gptUrl}`,
    {
      model: "gpt-4o-mini",
      prompt: `What do tourists need to know about ${countryName}?`,
      max_tokens: 256,
      temperature: 0.5,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gptKey}`,
      },
    }
  );
  return response.data;
};
