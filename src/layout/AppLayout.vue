<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
import AppSidebar from "@/layout/AppSidebar.vue";
import AppSidebarMobile from "@/layout/AppSidebarMobile.vue";

const props = defineProps<{
  padded?: boolean;
}>();

const mobileSidebarRef = ref();

function toggleSidebarMobile() {
  mobileSidebarRef.value.toggleSidebarMobile();
}
</script>

<template>
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="flex h-screen flex-1 overflow-hidden">
      <AppSidebar />
      <AppSidebarMobile ref="mobileSidebarRef" />
      <main
        class="flex-1 justify-center bg-surface-100 shadow-sm dark:bg-surface-900 lg:m-1 lg:rounded-xl lg:border lg:bg-surface-0 dark:lg:border-surface-800 dark:lg:bg-surface-850"
      >
        <AppTopbar @toggle-sidebar-mobile="toggleSidebarMobile" />
        <div
          class="h-[calc(100vh-4.7rem)] w-full overflow-y-auto rounded-b-2xl"
          :class="{ 'p-8': padded }"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
  <CookieBanner />
</template>
