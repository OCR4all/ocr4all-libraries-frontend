<script setup lang="ts">
import SelectButton from "primevue/selectbutton";

const category = useLocalStorage(
  "ocr4all/frontend/repository/category",
  "Images",
);
const options = ref(["Images", "Datasets", "Models", "Workflows"]);
</script>
<template>
  <div class="flex flex-col gap-y-6">
    <div class="flex justify-center">
      <SelectButton
        v-model="category"
        :options="options"
        aria-labelledby="basic"
      />
    </div>
    <div>
      <ImageView v-if="category === 'Images'" />
      <DatasetView v-else-if="category === 'Datasets'" />
      <WorkflowView v-else-if="category === 'Workflows'" />
    </div>
  </div>
</template>
