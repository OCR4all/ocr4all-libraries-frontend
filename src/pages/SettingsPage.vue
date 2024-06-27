<script setup lang="ts">
import {
  ArrowLeftIcon,
  LockClosedIcon,
  SparklesIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useAuthStore } from "@/stores/auth.store";

import Button from "primevue/button";
import { useUiStore } from "@/stores/ui.store";

const router = useRouter();

const active = ref("appearance");

const authStore = useAuthStore();
const uiStore = useUiStore();
console.log(uiStore);

const user = ref();
await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    user.value = response.data.value;
  });
</script>
<template>
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="h-screen overflow-hidden">
      <div
        class="group m-4 flex cursor-pointer justify-start gap-x-4"
        @click="router.back()"
      >
        <ArrowLeftIcon class="h-8 w-8 text-surface-950 dark:text-surface-100" />
        <p
          class="link-underline text-2xl text-surface-950 dark:text-surface-100"
        >
          Back
        </p>
      </div>
      <div class="flex justify-center">
        <div class="flex flex-1 items-start justify-center gap-4">
          <div
            class="min-w-72 rounded-xl border bg-surface-0 p-8 dark:border-surface-700 dark:bg-surface-900"
          >
            <ul class="space-y-2">
              <li
                class="hover:bg-surface-200/60 flex cursor-pointer items-center space-x-2 rounded-xl p-2"
                :class="{ 'bg-surface-200/70': active === 'profile' }"
                @click="active = 'profile'"
              >
                <AvatarInitials :name="user.name" small />
                <p class="text-sm text-surface-950 dark:text-surface-0">
                  Profile
                </p>
              </li>
              <li
                class="hover:bg-surface-200/60 flex cursor-pointer items-center space-x-2 rounded-xl p-2"
                :class="{ 'bg-surface-200/70': active === 'appearance' }"
                @click="active = 'appearance'"
              >
                <SparklesIcon
                  class="h-4 w-4 text-surface-950 dark:text-surface-100"
                />
                <p class="text-sm text-surface-950 dark:text-surface-0">
                  Appearance
                </p>
              </li>
              <li
                class="hover:bg-surface-200/60 flex cursor-pointer items-center space-x-2 rounded-xl p-2"
                :class="{ 'bg-surface-200/70': active === 'password' }"
                @click="active = 'password'"
              >
                <LockClosedIcon
                  class="h-4 w-4 text-surface-950 dark:text-surface-100"
                />
                <p class="text-sm text-surface-950 dark:text-surface-0">
                  Password
                </p>
              </li>
            </ul>
            <hr class="my-6 h-px border-0 bg-surface-200 dark:bg-surface-700" />
            <ul>
              <li
                class="hover:bg-surface-200/60 flex cursor-pointer items-center space-x-2 rounded-xl p-2"
                @click="authStore.logout()"
              >
                <ArrowLeftStartOnRectangleIcon
                  class="h-4 w-4 text-surface-950 dark:text-surface-100"
                />
                <p class="text-sm text-surface-950 dark:text-surface-0">
                  Sign Out
                </p>
              </li>
            </ul>
          </div>
          <div
            class="w-5/12 rounded-xl border bg-surface-0 p-8 dark:border-surface-700 dark:bg-surface-900"
          >
            <div v-if="active === 'profile'" id="profile-settings">
              <h1
                class="font-regular text-2xl text-surface-900 dark:text-surface-0"
              >
                Profile Settings
              </h1>
              <hr
                class="my-6 h-px border-0 bg-surface-200 dark:bg-surface-700"
              />
              <h2
                class="font-regular mb-2 text-xl text-surface-900 dark:text-surface-0"
              >
                General Information
              </h2>
              <div class="mb-4 space-y-4">
                <div>
                  <label
                    for="small-input"
                    class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >Name</label
                  >
                  <input
                    type="text"
                    id="small-input"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    for="small-input"
                    class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >Mail</label
                  >
                  <input
                    type="text"
                    id="small-input"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    for="small-input"
                    class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >Small input</label
                  >
                  <input
                    type="text"
                    id="small-input"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button label="Submit" />
            </div>
            <div
              v-else-if="active === 'appearance'"
              id="appearance-settings"
              class="@container/appearance"
            >
              <h1
                class="text-xl font-semibold text-surface-900 dark:text-surface-0"
              >
                Appearance
              </h1>
              <h3
                class="font-regular text-md text-surface-900 dark:text-surface-0"
              >
                Manage the application's appearance
              </h3>
              <hr
                class="my-6 h-px border-0 bg-surface-200 dark:bg-surface-700"
              />
              <h3
                class="text-md font-semibold text-surface-900 dark:text-surface-0"
              >
                Theme
              </h3>
              <div
                class="grid grid-cols-1 gap-8 py-4 @md/appearance:grid-cols-3"
              >
                <ThemeSkeleton theme="system" />
                <ThemeSkeleton theme="light" />
                <ThemeSkeleton theme="dark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.link-underline {
  border-bottom-width: 0;
  background-image: linear-gradient(transparent, transparent),
    linear-gradient(#6366f1, #6366f1);
  background-size: 0 3px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.5s ease-in-out;
}

.link-underline:hover {
  background-size: 100% 3px;
  background-position: 0 100%;
}
</style>
