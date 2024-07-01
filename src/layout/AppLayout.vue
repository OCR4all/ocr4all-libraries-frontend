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
  <Toast />
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="flex h-screen flex-1 overflow-hidden">
      <AppSidebar :mode="SidebarMode.Main" />
      <AppSidebarMobile ref="mobileSidebarRef" />
      <main
        class="flex-1 justify-center overflow-x-auto bg-surface-100 shadow-sm dark:bg-surface-950 lg:m-2 lg:rounded-xl lg:bg-surface-0 lg:dark:bg-surface-900"
      >
        <AppTopbar @toggle-sidebar-mobile="toggleSidebarMobile" />
        <div
          class="h-full lg:h-[calc(100vh-5rem)] w-full overflow-y-auto rounded-b-2xl"
          :class="{ 'p-8': padded }"
        >
          <transition name="fade-enter-from">
            <slot />
          </transition>
        </div>
      </main>
    </div>
  </div>
  <CookieBanner />
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
