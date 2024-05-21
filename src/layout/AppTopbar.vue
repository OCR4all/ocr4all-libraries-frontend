<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
const authStore = useAuthStore();

const router = useRouter();

defineEmits(["toggle-sidebar-mobile"]);
</script>

<template>
  <nav
    class="z-20 flex h-16 justify-between bg-surface-100 px-3 py-3 dark:bg-surface-900 md:space-x-6 md:border-solid md:border-surface-200 md:px-6 dark:md:border-surface-700 lg:rounded-t-2xl lg:border-b lg:bg-white dark:lg:bg-surface-800"
  >
    <div class="flex space-x-6 lg:hidden">
      <img
        src="/img/logo.svg"
        class="h-10 w-10 cursor-pointer"
        alt="OCR4all logo"
        @click="router.push({ name: 'Dashboard' })"
      />
      <button
        v-tooltip="'Toggle Sidebar'"
        class="mt-1 cursor-pointer rounded-md text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:bg-surface-100 focus:ring-4 focus:ring-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white dark:focus:bg-surface-700 dark:focus:ring-surface-700 lg:block"
        type="button"
        value="Open sidebar"
        @click="$emit('toggle-sidebar-mobile')"
      >
        <Bars3CenterLeftIcon class="h-8 w-8" />
      </button>
    </div>
    <div class="flex">
      <BreadcrumbNavigation />
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
