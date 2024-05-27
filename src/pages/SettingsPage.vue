<script setup lang="ts">
import {
  ArrowLeftIcon,
  LockClosedIcon,
  SparklesIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useAuthStore } from "@/stores/auth.store";

import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";

const router = useRouter();

const active = ref("profile");

const authStore = useAuthStore();

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
      <div class="m-4 flex justify-start">
        <ArrowLeftIcon
          class="h-6 w-6 cursor-pointer text-surface-950 hover:animate-bounce dark:text-surface-100"
          @click="router.push('/')"
        />
      </div>
      <div class="flex justify-center">
        <div class="grid grid-cols-2 items-start gap-4">
          <div
            class="rounded-xl border bg-surface-0 p-8 dark:border-surface-700 dark:bg-surface-900"
          >
            <ul class="space-y-2">
              <li
                class="flex cursor-pointer items-center space-x-2 rounded-xl bg-surface-200 p-2 hover:bg-surface-100"
                @click="active = 'profile'"
              >
                <AvatarInitials :name="user.name" small />
                <p class="text-sm text-surface-950 dark:text-surface-0">
                  Profile
                </p>
              </li>
              <li
                class="flex cursor-pointer items-center space-x-2 rounded-xl p-2 hover:bg-surface-100"
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
                class="flex cursor-pointer items-center space-x-2 rounded-xl p-2 hover:bg-surface-100"
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
                class="flex cursor-pointer items-center space-x-2 rounded-xl p-2 hover:bg-surface-100"
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
            class="rounded-xl border bg-surface-0 p-8 dark:border-surface-700 dark:bg-surface-900"
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
              <ActionButton rounded size="large" type="primary">
                Save
              </ActionButton>
            </div>
            <div
              v-else-if="active === 'appearance'"
              id="appearance-settings"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
