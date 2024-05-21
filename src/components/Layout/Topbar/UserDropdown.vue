<script setup lang="ts">
interface IUserDropdownEntry {
  action: () => void;
  name: string;
  adminOnly: boolean;
}

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const router = useRouter();

const uiStore = useUiStore();
const authStore = useAuthStore();

const user: Ref<object | undefined> = ref()

const items: IUserDropdownEntry[] = [
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

await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    user.value = response.data.value
  })
</script>

<template>
  <Menu as="div">
    <MenuButton
      class="mx-2 my-1 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <AvatarInitials :name="user.name" status="admin" />
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
        class="absolute right-0 !z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-md border border-surface-100 bg-white shadow-lg focus:outline-none dark:border-surface-700 dark:bg-surface-800"
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
