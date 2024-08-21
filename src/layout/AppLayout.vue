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
  <Toast position="top-center" group="general" />
  <Toast position="top-center" group="jobs">
    <template #container="{ message, closeCallback }">
      <p>Global</p>
    </template>
  </Toast>
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="flex h-screen flex-1 overflow-hidden">
      <AppSidebar :mode="SidebarMode.Main" />
      <AppSidebarMobile :mode="SidebarMode.Main" ref="mobileSidebarRef" />
      <main
        class="flex-1 justify-center overflow-x-auto bg-surface-100 shadow-md dark:bg-surface-950 lg:m-2 lg:rounded-md lg:bg-surface-0 lg:dark:bg-surface-900"
      >
        <AppTopbar @toggle-sidebar-mobile="toggleSidebarMobile" />
        <div
          class="h-[calc(100vh-4rem)] w-full overflow-y-auto rounded-b-2xl lg:h-[calc(100vh-5rem)]"
          :class="{ 'p-8': props.padded }"
        >
          <MobileBreadcrumbNavigation />
          <slot />
        </div>
      </main>
    </div>
  </div>
  <CookieBanner />
</template>
<style></style>
