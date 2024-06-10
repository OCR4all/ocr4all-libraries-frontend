<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore()
uiStore.breadcrumb = [
  {
    label: "Queue",
  },
]
</script>

<template>
  <AppLayout padded>
    <QueueComponent />
  </AppLayout>
</template>
