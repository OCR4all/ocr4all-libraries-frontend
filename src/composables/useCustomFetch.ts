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
    async onFetchError(ctx) {
      if (ctx.response!.status == 401) {
        /* TODO: Change this as soon as we have a working auth workflow.
        *   Currently there is no good way to check whether a token is still valid
        *   as tokens may expire before their supplied expiry date. */
        await auth.logout();
      }else{
        return ctx
      }
    },
  },
  fetchOptions: {
    mode: "cors",
  },
});
