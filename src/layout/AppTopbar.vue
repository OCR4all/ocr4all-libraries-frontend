<script setup lang="ts">
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth.store";
const authStore = useAuthStore();
</script>

<template>
  <nav
    class="flex h-16 justify-between space-x-6 border-b border-solid border-gray-200 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-zinc-800 md:space-x-6 md:px-6 z-20"
  >
    <div class="ml-2 flex">
      <button
        @click="$emit('toggle-sidebar-lg', false)"
        class="mt-1 text-gray-600 rounded-lg cursor-pointer hidden lg:block hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
        value="Open sidebar"
      >
        <Bars3CenterLeftIcon class="h-8 w-8" />
      </button>
      <button
        @click="$emit('toggle-sidebar-md', false)"
        class="mt-1 text-gray-600 rounded-lg cursor-pointer block lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
        value="Open sidebar"
      >
        <Bars3CenterLeftIcon class="h-8 w-8" />
      </button>
      <img src="/img/logo.svg" class="ml-8 h-10 w-10" alt="OCR4all logo" />
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
