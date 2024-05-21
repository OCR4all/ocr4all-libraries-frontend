<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
const authStore = useAuthStore();

const router = useRouter();

defineEmits(['toggle-sidebar-mobile'])
</script>

<template>
  <nav
    class="z-20 flex h-16 justify-between rounded-t-2xl border-b border-solid border-surface-200 dark:border-surface-700 bg-white px-3 py-3 dark:bg-surface-800 md:space-x-6 md:px-6"
  >
    <div class="flex lg:hidden space-x-6">
      <img
        @click="router.push({ name: 'Dashboard' })"
        src="/img/logo.svg"
        class="h-10 w-10 cursor-pointer"
        alt="OCR4all logo"
      />
      <button
        @click="$emit('toggle-sidebar-mobile')"
        class="mt-1 cursor-pointer rounded-md text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:bg-surface-100 focus:ring-4 focus:ring-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white dark:focus:bg-surface-700 dark:focus:ring-surface-700 lg:block"
        type="button"
        value="Open sidebar"
        v-tooltip="'Toggle Sidebar'"
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
