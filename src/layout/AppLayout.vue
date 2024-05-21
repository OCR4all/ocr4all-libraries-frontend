<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
import AppSidebar from "@/layout/AppSidebar.vue";

const props = defineProps<{
  padded?: boolean
}>()

const sidebarRef = ref();

function toggleSidebarMobile() {
  sidebarRef.value.toggleSidebarMobile();
}
</script>

<template>
  <SettingsDialog />
  <div class="h-screen bg-surface-100 dark:bg-surface-950">
    <div class="h-screen flex flex-1 overflow-hidden">
      <AppSidebar ref="sidebarRef" />
      <main
        class="flex-1 lg:rounded-xl justify-center shadow-sm border dark:border-surface-800 bg-surface-0 lg:m-2 dark:bg-surface-800"
      >
        <AppTopbar
          @toggle-sidebar-mobile="toggleSidebarMobile"
        />
        <div class="h-[calc(100vh-82px)] w-full overflow-y-auto rounded-b-2xl" :class="{'p-8': padded}">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
