<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import { useUiStore } from "@/stores/ui.store";

const router = useRouter();

enum Section {
  images = "Images",
  datasets = "Datasets",
  models = "Models",
  workflows = "Workflows",
}

const section = useLocalStorage(
  "ocr4all/frontend/repository/category",
  "Images",
);

const sectionQuery = router.currentRoute.value.query.section;

if (
  sectionQuery &&
  typeof sectionQuery === "string" &&
  Object.values(Section).includes(sectionQuery as Section)
) {
  section.value = sectionQuery;
}

const options = ref(["Images", "Datasets", "Models", "Workflows"]);

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Repository",
    to: "/repository/overview",
  },
];
</script>
<template>
  <div class="flex flex-col gap-y-6">
    <div class="flex justify-center">
      <SelectButton
        v-model="section"
        :options="options"
        :allow-empty="false"
        aria-labelledby="basic"
      />
    </div>
    <div>
      <ImageView v-if="section === 'Images'" />
      <DatasetView v-else-if="section === 'Datasets'" />
      <ModelOverview v-else-if="section === 'Models'" />
      <WorkflowView v-else-if="section === 'Workflows'" />
    </div>
  </div>
</template>
