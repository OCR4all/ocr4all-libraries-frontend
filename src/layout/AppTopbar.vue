<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import IconBars from "~icons/heroicons/bars-3-center-left-16-solid"
const authStore = useAuthStore();

const router = useRouter();

defineEmits(["toggle-sidebar-mobile"]);
</script>

<template>
  <nav
    class="z-20 flex h-16 justify-between bg-surface-100 px-10 py-3 dark:bg-surface-950 md:border-solid md:border-surface-200 dark:md:border-surface-800 lg:space-x-6 lg:rounded-t-2xl lg:border-b lg:bg-white lg:px-4 lg:dark:bg-surface-900"
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
        <IconBars class="h-8 w-8" />
      </button>
    </div>
    <div class="flex">
      <BreadcrumbNavigation />
    </div>
    <div class="flex gap-x-0.5">
      <ModeTag />
      <InstanceTag />
      <NotificationDropdown />
      <DarkModeToggle />
      <div class="self-center" v-show="authStore.user">
        <UserDropdown />
      </div>
    </div>
  </nav>
</template>
