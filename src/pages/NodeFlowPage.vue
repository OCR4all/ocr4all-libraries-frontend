<script setup lang="ts">
import WorkflowEditor from "@/components/NodeFlow/NodeFlow.vue";
import AppLayout from "@/layout/AppLayout.vue";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "NodeFlow",
  },
];
</script>

<template>
  <AppLayout>
    <WorkflowEditor />
  </AppLayout>
</template>
