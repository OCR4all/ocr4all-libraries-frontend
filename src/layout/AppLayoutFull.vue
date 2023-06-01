<script setup lang="ts">
import AppTopbar from "@/layout/AppTopbar.vue";
import AppSidebar from "@/layout/AppSidebar.vue";

const sidebarRef = ref();

function toggleSidebarMd() {
  sidebarRef.value.toggleSidebarMd(true);
}

function toggleSidebarLg() {
  sidebarRef.value.toggleSidebarLg();
}
</script>

<template>
  <div class="flex h-screen flex-col bg-gray-100 dark:bg-zinc-900">
    <AppTopbar
      @toggle-sidebar-md="toggleSidebarMd"
      @toggle-sidebar-lg="toggleSidebarLg"
    />
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar ref="sidebarRef" />
      <main
        class="mx-auto flex flex-1 justify-center overflow-y-auto bg-gray-100 px-8 py-8 dark:bg-zinc-900 2xl:px-36"
      >
        <div class="h-full w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
