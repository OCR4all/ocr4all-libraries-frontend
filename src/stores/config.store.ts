import { defineStore } from "pinia";
import axios from "axios";

export const useConfigStore = defineStore("config", () => {
  const baseUrl: Ref<string | undefined> = ref()
  const larexUrl: Ref<string | undefined> = ref()

  if (import.meta.env.DEV) {
    baseUrl.value = import.meta.env.VITE_API_BASE_URL;
    larexUrl.value = import.meta.env.VITE_LAREX_URL;
  } else if (import.meta.env.PROD) {
    baseUrl.value = window.appConfig.apiBaseUrl;
    larexUrl.value = window.appConfig.larexUrl;
  }

  axios.defaults.timeout = 100000;
  axios.defaults.baseURL = baseUrl.value;

  return { baseUrl, larexUrl };
});
