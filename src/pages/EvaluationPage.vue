<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import {useUiStore} from "@/stores/ui.store";

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
  <div class="h-full flex flex-col items-center justify-center">
    <h1 class="text-5xl text-black dark:text-white font-bold mb-8 animate-pulse">
      Coming Soon
    </h1>
    <p class="text-surface-800 dark:text-surface-100 text-lg mb-8">
      We're working hard to bring you something amazing. Stay tuned!
    </p>
  </div>
  </AppLayout>
</template>
