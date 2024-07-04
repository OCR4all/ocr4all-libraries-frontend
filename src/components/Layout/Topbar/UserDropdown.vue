<script setup lang="ts">
import {
  UserIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";

interface IUserDropdownEntry {
  action: () => void;
  label: string;
  icon: any;
}

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useAuthStore } from "@/stores/auth.store";
import { RemovableRef } from "@vueuse/core";

const router = useRouter();

const authStore = useAuthStore();

const op = ref();

const user: RemovableRef<object> = ref();

const profileItems: IUserDropdownEntry[] = [
  { action: openSettings, label: "Settings", icon: Cog8ToothIcon },
];

const adminItems: IUserDropdownEntry[] = [
  { action: openAdminDashboard, label: "Admin", icon: UserIcon },
];

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
  });

const toggle = (event) => {
  op.value.toggle(event);
};
</script>

<template>
  <button class="flex px-1 items-center" @click="toggle">
    <AvatarInitials :name="user.name" :admin="authStore.isAdmin" size="md" selectable />
  </button>
  <Popover ref="op" class="mr-1">
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
        class="my-1 flex transform items-center rounded-md px-3 py-2 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="item.action"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="mx-1">{{ item.label }}</span>
      </button>
      <hr
        v-show="authStore.isAdmin"
        class="border-gray-200 dark:border-gray-700"
      />
      <button
        v-for="(item, index) in adminItems"
        v-show="authStore.isAdmin"
        :key="index"
        class="my-1 flex transform items-center rounded-md px-3 py-2 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-primary-700 hover:text-surface-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="item.action"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="mx-1">{{ item.label }}</span>
      </button>
      <hr class="border-gray-200 dark:border-gray-700" />
      <a
        class="my-1 flex transform items-center rounded-md px-3 py-2 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        href="https://www.ocr4all.org"
        target="_blank"
      >
        <QuestionMarkCircleIcon class="h-6 w-6" />
        <span class="mx-1">Documentation</span>
      </a>
      <button
        class="my-1 flex transform items-center rounded-md px-3 py-2 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="logout"
      >
        <ArrowLeftStartOnRectangleIcon class="h-6 w-6" />
        <span class="mx-1">Sign Out</span>
      </button>
    </div>
  </Popover>
</template>
