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

const otherItems: IUserDropdownEntry[] = [
  { action: logout, label: "Admin", icon: UserIcon},
  { action: logout, label: "Admin", icon: UserIcon}
]

function openSettings() {
  router.push("/settings");
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
  <OverlayPanel class="mr-1" ref="op">
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
       @click="item.action"
        class="flex transform items-center p-3 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="mx-1">{{ item.label }}</span>
      </button>
      <hr v-show="authStore.isAdmin" class="border-gray-200 dark:border-gray-700" />
      <button
        v-for="(item, index) in adminItems"
        v-show="authStore.isAdmin"
        @click="item.action"
        :key="index"
        class="flex transform items-center p-3 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="mx-1">{{ item.label }}</span>
      </button>
      <hr class="border-gray-200 dark:border-gray-700" />
      <a
        href="#"
        class="flex transform items-center p-3 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <svg
          class="mx-1 h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C6.47967 21.9939 2.00606 17.5203 2 12V11.8C2.10993 6.30452 6.63459 1.92794 12.1307 2.00087C17.6268 2.07379 22.0337 6.56887 21.9978 12.0653C21.9619 17.5618 17.4966 21.9989 12 22ZM11.984 20H12C16.4167 19.9956 19.9942 16.4127 19.992 11.996C19.9898 7.57928 16.4087 3.99999 11.992 3.99999C7.57528 3.99999 3.99421 7.57928 3.992 11.996C3.98979 16.4127 7.56729 19.9956 11.984 20ZM13 18H11V16H13V18ZM13 15H11C10.9684 13.6977 11.6461 12.4808 12.77 11.822C13.43 11.316 14 10.88 14 9.99999C14 8.89542 13.1046 7.99999 12 7.99999C10.8954 7.99999 10 8.89542 10 9.99999H8V9.90999C8.01608 8.48093 8.79333 7.16899 10.039 6.46839C11.2846 5.76778 12.8094 5.78493 14.039 6.51339C15.2685 7.24184 16.0161 8.57093 16 9.99999C15.9284 11.079 15.3497 12.0602 14.44 12.645C13.6177 13.1612 13.0847 14.0328 13 15Z"
            fill="currentColor"
          ></path>
        </svg>

        <span class="mx-1"> Help </span>
      </a>
      <a
        href="#"
        class="flex transform items-center p-3 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <svg
          class="mx-1 h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
            fill="currentColor"
          ></path>
        </svg>
        <span class="mx-1"> Sign Out </span>
      </a>
    </div>
  </OverlayPanel>
</template>
