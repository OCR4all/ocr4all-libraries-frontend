<script setup lang="ts">
import { Bars3Icon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth.store";
const authStore = useAuthStore();
</script>

<template>
  <nav
    class="flex h-16 justify-between space-x-6 border-b border-gray-200 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-zinc-800 md:space-x-6 md:px-6"
  >
    <div class="ml-2 flex flex-1">
      <img src="/img/logo.svg" class="h-10 w-10" alt="OCR4all logo" />
      <button
        @click="$emit('toggle-sidebar-lg', false)"
        class="ml-40 mt-2 flex hidden h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-600 hover:ring-2 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:text-white lg:block"
        type="button"
        value="Open sidebar"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>
    </div>
    <div class="flex flex-1 items-center">
      <button
        @click="$emit('toggle-sidebar-md', true)"
        class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-600 hover:ring-2 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:text-white lg:hidden"
        type="button"
        value="Open sidebar"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>
    </div>
    <DarkModeToggle />
    <div v-show="authStore.user">
      <UserDropdown />
    </div>
  </nav>
</template>

<style scoped></style>
