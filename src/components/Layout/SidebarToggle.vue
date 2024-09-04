<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";

import IconToggle from "~icons/heroicons/bars-3-center-left";

const uiStore = useUiStore();

function toggleSidebar() {
  uiStore.sidebarMinimized = !uiStore.sidebarMinimized;
}
</script>
<template>
  <button
    v-tooltip="'Toggle Sidebar'"
    class="mt-1 hidden cursor-pointer self-center rounded-md text-surface-600 hover:bg-surface-0 hover:text-surface-900 focus:bg-surface-0 focus:ring-4 focus:ring-surface-0 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white dark:focus:bg-surface-700 dark:focus:ring-surface-700 lg:block"
    type="button"
    value="Open sidebar"
    @click="toggleSidebar"
  >
    <IconToggle class="h-8 w-8" />
  </button>
</template>
