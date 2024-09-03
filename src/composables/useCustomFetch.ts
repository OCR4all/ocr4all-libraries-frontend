import { createFetch } from "@vueuse/core";
import { useConfigStore } from "@/stores/config.store";
import { useAuthStore } from "@/stores/auth.store";

const config = useConfigStore();
const auth = useAuthStore();
export const useCustomFetch = createFetch({
  baseUrl: config.baseUrl,
  options: {
    async beforeFetch({ options }) {
      if (config.mode !== "Desktop") {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${auth.token}`,
        };
      }
      return { options };
    },
  },
  fetchOptions: {
    mode: "cors",
  },
});
