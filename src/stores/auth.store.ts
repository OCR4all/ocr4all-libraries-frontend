import { defineStore } from "pinia";

import router from "@/router";

import { useConfigStore } from "@/stores/config.store";
import { RemovableRef, useStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  const user: RemovableRef<string | undefined> = useStorage(
    "pinia/auth/username",
    undefined
  );
  const token: RemovableRef<string | undefined> = useStorage(
    "pinia/auth/token",
    undefined
  );
  const authority: RemovableRef<string | undefined> = useStorage(
    "pinia/auth/authority",
    undefined
  );
  const returnUrl: undefined | string = undefined;
  const config = useConfigStore();
  async function login(username: string, password: string) {
    const { error, data } = await useFetch(`${config.baseUrl}/login`)
      .post({ username: username, password: password })
      .json();
    if (!error.value) {
      user.value = data.value.username;
      token.value = data.value.token;
      authority.value = data.value.authority;
      await router.push(returnUrl || "/");
    } else {
      throw Error;
    }
  }

  const isAdmin = computed(() => {
    return authority.value === "administrator";
  });
  async function logout() {
    user.value = undefined;
    token.value = undefined;
    authority.value = undefined;
    await router.push("/login");
  }

  return { user, token, returnUrl, isAdmin, login, logout };
});
