<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
import AppSidebar from "@/layout/AppSidebar.vue";
import AppSidebarMobile from "@/layout/AppSidebarMobile.vue";

import DynamicDialog from "primevue/dynamicdialog";
import { SidebarMode } from "@/layout/Layout";

const props = defineProps<{
  padded?: boolean;
}>();

const mobileSidebarRef = ref();

function toggleSidebarMobile() {
  mobileSidebarRef.value.toggleSidebarMobile();
}
</script>

<template>
  <DynamicDialog />
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="flex h-screen flex-1 overflow-hidden">
      <AppSidebar :mode="SidebarMode.Main" />
      <AppSidebarMobile ref="mobileSidebarRef" />
      <main
        class="flex-1 overflow-x-auto justify-center bg-surface-100 shadow-sm dark:bg-surface-900 lg:m-2 lg:rounded-xl lg:bg-surface-0"
      >
        <AppTopbar @toggle-sidebar-mobile="toggleSidebarMobile" />
        <div
          class="h-[calc(100vh-5rem)] w-full overflow-y-auto rounded-b-2xl"
          :class="{ 'p-8': padded }"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
  <CookieBanner />
</template>
