<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
import AppSidebar from "@/layout/AppSidebar.vue";
import AppSidebarMobile from "@/layout/AppSidebarMobile.vue";

import { SidebarMode } from "@/layout/Layout";

import DynamicDialog from "primevue/dynamicdialog";

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
  <Toast />
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="flex h-screen flex-1 overflow-hidden">
      <AppSidebar :mode="SidebarMode.Admin" />
      <AppSidebarMobile ref="mobileSidebarRef" />
      <main
        class="flex-1 justify-center overflow-x-auto bg-surface-100 shadow-sm dark:bg-surface-950 lg:m-2 lg:rounded-xl lg:bg-surface-0 lg:dark:bg-surface-900"
      >
        <AppTopbar @toggle-sidebar-mobile="toggleSidebarMobile" />
        <div
          class="h-[calc(100vh-5rem)] w-full overflow-y-auto rounded-b-2xl"
          :class="{ 'p-8': props.padded }"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
  <CookieBanner />
</template>
