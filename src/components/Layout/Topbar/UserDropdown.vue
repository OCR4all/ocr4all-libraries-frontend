<script setup lang="ts">
import {
  UserIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftStartOnRectangleIcon
} from "@heroicons/vue/24/outline";

interface IUserDropdownEntry {
  action: () => void;
  label: string;
  icon: any;
}

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";

import OverlayPanel from "primevue/overlaypanel";
import Button from "primevue/button";

const router = useRouter();

const uiStore = useUiStore();
const authStore = useAuthStore();

const op = ref();

const user: Ref<object | undefined> = ref();

const profileItems: IUserDropdownEntry[] = [
  { action: openSettings, label: "Settings", icon: Cog8ToothIcon }
];

const adminItems: IUserDropdownEntry[] = [
  { action: openAdminDashboard, label: "Admin", icon: UserIcon}
]

function openSettings() {
  router.push("/settings");
}

function openHelp() {

}

function openAdminDashboard() {
  router.push("/admin");
}
function logout() {
  authStore.logout();
}

await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    user.value = response.data.value;
    console.log(user.value);
  });

const toggle = (event) => {
  op.value.toggle(event);
};
</script>

<template>
  <button class="pt-1 pl-1" @click="toggle">
    <AvatarInitials :name="user.name" status="admin" />
  </button>
  <OverlayPanel ref="op" class="mr-1">
    <div class="flex flex-col">
      <div
        class="-mt-2 flex transform items-center p-3 text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-white"
      >
        <div class="mx-1">
          <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {{ user.name }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ user.email }}
          </p>
        </div>
      </div>
      <hr class="border-gray-200 dark:border-gray-700" />
      <button
        v-for="(item, index) in profileItems"
        :key="index"
        class="flex transform items-center p-3 my-1 text-sm capitalize text-gray-600 transition-colors duration-300 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="item.action"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="mx-1">{{ item.label }}</span>
      </button>
      <hr v-show="authStore.isAdmin" class="border-gray-200 dark:border-gray-700" />
      <button
        v-for="(item, index) in adminItems"
        v-show="authStore.isAdmin"
        :key="index"
        class="flex transform items-center p-3 my-1 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="item.action"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="mx-1">{{ item.label }}</span>
      </button>
      <hr class="border-gray-200 dark:border-gray-700" />
      <a class="flex transform items-center px-3 py-2 my-1 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
         href="https://www.ocr4all.org" target="_blank">
        <QuestionMarkCircleIcon class="h-6 w-6" />
        <span class="mx-1">Help</span>
      </a>
      <button
        class="flex transform items-center px-3 py-2 my-1 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="logout"
      >
        <ArrowLeftStartOnRectangleIcon class="h-6 w-6" />
        <span class="mx-1">Sign Out</span>
      </button>
    </div>
  </OverlayPanel>
</template>
