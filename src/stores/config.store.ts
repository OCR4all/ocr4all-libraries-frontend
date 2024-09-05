import { defineStore } from "pinia";
import axios from "axios";

export const useConfigStore = defineStore("config", () => {
  const baseUrl: string = import.meta.env.VITE_API_URL;
  const mode: string = import.meta.env.VITE_DESKTOP_MODE;

  axios.defaults.timeout = 100000;
  axios.defaults.baseURL = baseUrl;

  return { baseUrl, mode };
});
