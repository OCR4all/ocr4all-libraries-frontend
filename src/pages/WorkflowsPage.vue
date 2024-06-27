<script setup lang="ts">
import Workflows from "@/components/Workflows/WorkflowOverview.vue";
import AppLayout from "@/layout/AppLayout.vue";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();

uiStore.breadcrumb = [
  {
    label: "Workflows",
    to: "/workflows",
  },
];
</script>

<template>
  <AppLayout padded>
    <Workflows />
  </AppLayout>
</template>
