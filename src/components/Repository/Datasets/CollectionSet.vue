<script setup lang="ts">
import { LocationQueryValue, Router } from "vue-router";
import { useUiStore } from "@/stores/ui.store";

const router: Router = useRouter();
const dataset: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.id;
const datasetName: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.name;

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Repository",
    to: "/repository/overview",
  },
  {
    label: "Dataset",
    to: "/repository/overview",
  },
  {
    label: datasetName,
  },
];

useHead({
  title: datasetName,
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

</script>
<template>
{{datasetName }}
  {{ dataset }}
</template>
