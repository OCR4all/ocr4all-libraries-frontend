<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { UserIcon } from "@heroicons/vue/24/solid";

const router = useRouter();

import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
const authStore = useAuthStore();
const items = [
  { action: openSettings, name: "Settings", adminOnly: false },
  { action: openAdminDashboard, name: "Admin", adminOnly: true },
  { action: logout, name: "Log Out", adminOnly: false },
];

function openSettings() {
  uiStore.settingsDialogOpen = true;
}

function openAdminDashboard() {
  router.push("/admin");
}
function logout() {
  authStore.logout();
}
</script>

<template>
  <Menu as="div" class="mt-2">
    <MenuButton
      class="mx-2 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <UserIcon
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 text-surface-500 transition duration-75 group-hover:text-surface-900 dark:text-surface-400 dark:group-hover:text-white"
      />
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out transform"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in transform"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <MenuItems
        class="absolute right-0 !z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-md border border-surface-100 bg-white shadow-lg focus:outline-none dark:border-surface-700 dark:bg-zinc-800"
      >
        <template v-for="(item, index) in items" :key="index">
          <MenuItem
            v-show="!item.adminOnly || (item.adminOnly && authStore.isAdmin)"
            v-slot="{ active }"
          >
            <a
              href="#"
              :class="{
                'bg-surface-100': active,
                'dark:bg-surface-500': active,
              }"
              class="block px-4 py-2 text-sm text-surface-700 dark:text-white"
              @click="item.action"
              >{{ item.name }}</a
            >
          </MenuItem>
        </template>
      </MenuItems>
    </transition>
  </Menu>
</template>
