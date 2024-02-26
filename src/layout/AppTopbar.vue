<script setup lang="ts">
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth.store";
const authStore = useAuthStore();
const router = useRouter();
</script>

<template>
  <nav
    class="z-20 flex h-16 justify-between space-x-6 border-b border-solid border-surface-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-800 md:space-x-6 md:px-6"
  >
    <div class="flex">
      <img
        @click="router.push({ name: 'Dashboard' })"
        src="/img/logo.svg"
        class="ml-1 mr-8 mt-1 h-8 w-8 cursor-pointer"
        alt="OCR4all logo"
      />
      <button
        @click="$emit('toggle-sidebar-lg', false)"
        class="mt-1 hidden cursor-pointer rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:bg-surface-100 focus:ring-4 focus:ring-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white dark:focus:bg-surface-700 dark:focus:ring-surface-700 lg:block"
        type="button"
        value="Open sidebar"
        v-tooltip="'Toggle Sidebar'"
      >
        <Bars3CenterLeftIcon class="h-8 w-8" />
      </button>
      <button
        @click="$emit('toggle-sidebar-md', false)"
        class="mt-1 block cursor-pointer rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:bg-surface-100 focus:ring-4 focus:ring-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white dark:focus:bg-surface-700 dark:focus:ring-surface-700 lg:hidden"
        type="button"
        value="Open sidebar"
        v-tooltip="'Open Sidebar'"
      >
        <Bars3CenterLeftIcon class="h-8 w-8" />
      </button>
    </div>
    <div class="flex">
      <NotificationDropdown />
      <DarkModeToggle />
      <div v-show="authStore.user">
        <UserDropdown />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
