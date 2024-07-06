<script setup lang="ts">
import SelectButton from "primevue/selectbutton";

const router = useRouter()

enum Section {
  images = "Images",
  datasets = "Datasets",
  models = "Models",
  workflows = "Workflows"
}

const section = useLocalStorage(
  "ocr4all/frontend/repository/category",
  "Images",
);

const sectionQuery = router.currentRoute.value.query.section

if(sectionQuery && typeof sectionQuery === "string" && Object.values(Section).includes(sectionQuery as Section)){
  section.value = sectionQuery
}

const options = ref(["Images", "Datasets", "Models", "Workflows"]);
</script>
<template>
  <div class="flex flex-col gap-y-6">
    <div class="flex justify-center">
      <SelectButton
        v-model="section"
        :options="options"
        aria-labelledby="basic"
      />
    </div>
    <div>
      <ImageView v-if="section === 'Images'" />
      <DatasetView v-else-if="section === 'Datasets'" />
      <WorkflowView v-else-if="section === 'Workflows'" />
    </div>
  </div>
</template>
