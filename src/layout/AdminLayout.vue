<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
import AppSidebar from "@/layout/AppSidebar.vue";
import AppSidebarMobile from "@/layout/AppSidebarMobile.vue";

import { SidebarMode } from "@/layout/Layout";

import DynamicDialog from "primevue/dynamicdialog";
import { useUiStore } from "@/stores/ui.store";

const props = defineProps<{
  padded?: boolean;
}>();

const store = useUiStore();

const mobileSidebarRef = ref();

function toggleSidebarMobile() {
  mobileSidebarRef.value.toggleSidebarMobile();
}
</script>

<template>
  <DynamicDialog />
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="flex h-screen flex-1 overflow-hidden">
      <AppSidebar :mode="SidebarMode.Admin" />
      <AppSidebarMobile :mode="SidebarMode.Admin" ref="mobileSidebarRef" />
      <main
        class="flex-1 justify-center overflow-x-auto bg-surface-100 shadow-md dark:bg-surface-950 lg:m-2 lg:rounded-md lg:bg-surface-0 lg:dark:bg-surface-900"
      >
        <AppTopbar @toggle-sidebar-mobile="toggleSidebarMobile" mode="admin" />
        <MobileBreadcrumbNavigation />
        <div
          class="w-full overflow-y-auto rounded-b-2xl lg:h-[calc(100vh-6rem)]"
          :class="[
            props.padded ? 'p-8' : 'p-0',
            store.breadcrumb && store.breadcrumb.length > 1
              ? 'h-[calc(100vh-7rem)]'
              : 'h-[calc(100vh-4rem)]',
          ]"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
  <CookieBanner />
</template>
