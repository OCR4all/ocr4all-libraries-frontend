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

useHead({
  title: "NodeFlow",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <AppLayout>
    <WorkflowEditor />
  </AppLayout>
</template>
