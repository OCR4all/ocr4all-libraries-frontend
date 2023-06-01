import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
  const baseUrl: string = import.meta.env.VITE_API_URL;
  const mode: string = import.meta.env.VITE_DESKTOP_MODE;

  return { baseUrl, mode };
});
