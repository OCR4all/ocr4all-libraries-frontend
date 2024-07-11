<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Evaluation",
  },
];

useHead({
  title: "Evaluation",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>
<template>
  <AppLayout>
    <div class="flex h-full flex-col items-center justify-center">
      <h1
        class="mb-8 animate-pulse text-5xl font-bold text-black dark:text-white"
      >
        Coming Soon
      </h1>
      <p class="mb-8 text-lg text-surface-800 dark:text-surface-100">
        We're working hard to bring you something amazing. Stay tuned!
      </p>
    </div>
  </AppLayout>
</template>
