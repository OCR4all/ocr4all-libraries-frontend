<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Repository",
    to: "/repository",
  },
];
</script>

<template>
  <AppLayout padded>
    <router-view />
  </AppLayout>
</template>
