<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import Dashboard from "@/components/Dashboard/DashboardView.vue";

useHead({
  title: "Dashboard ",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <AppLayout padded>
    <Dashboard />
  </AppLayout>
</template>
