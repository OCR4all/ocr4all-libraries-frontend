<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";

useHead({
  title: "Training",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <AppLayout padded> </AppLayout>
</template>
