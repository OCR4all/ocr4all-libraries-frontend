<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";

import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Projects",
  },
  {
    label: "Overview",
    to: "/project/overview",
  },
];

useHead({
  title: "Projects",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <AppLayout padded>
    <router-view />
  </AppLayout>
</template>
