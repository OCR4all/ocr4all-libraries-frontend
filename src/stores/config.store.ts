import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
  const baseUrl: string = import.meta.env.VITE_API_URL;
  const mode: string = import.meta.env.VITE_DESKTOP_MODE;

  const instanceTag: Ref<string | null> = null


  return { baseUrl, mode };
});
