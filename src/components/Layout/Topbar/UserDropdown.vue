<script setup lang="ts">
import IconAdmin from "~icons/eos-icons/admin-outlined"
import IconCog from "~icons/line-md/cog";
import IconDocumentation from "~icons/oui/documentation"
import IconLogout from "~icons/solar/logout-2-outline"

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
  { action: openSettings, label: "Settings", icon: IconCog },
];

const adminItems: IUserDropdownEntry[] = [
  { action: openAdminDashboard, label: "Admin", icon: IconAdmin },
];

function openSettings() {
  router.push("/settings");
}

function openAdminDashboard() {
  router.push({name: "Admin"})
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
  <button class="flex items-center px-1" @click="toggle">
    <AvatarInitials
      :name="user.name"
      :admin="authStore.isAdmin"
      size="md"
      selectable
    />
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
      <hr class="border-gray-200 dark:border-gray-700" />
      <a
        class="my-1 flex transform items-center rounded-md px-3 py-2 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        href="https://www.ocr4all.org"
        target="_blank"
      >
        <IconDocumentation class="h-6 w-6" />
        <span class="mx-1">Documentation</span>
      </a>
      <button
        class="my-1 flex transform items-center rounded-md px-3 py-2 text-sm capitalize text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white"
        @click="logout"
      >
        <IconLogout class="h-6 w-6" />
        <span class="mx-1">Sign Out</span>
      </button>
    </div>
  </Popover>
</template>
