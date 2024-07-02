<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import DatasetView from "@/components/Repository/Datasets/DatasetView.vue";

const category = useLocalStorage("ocr4all/frontend/repository/category", "Images");
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
    <div v-auto-animate>
      <ImageView v-if="category === 'Images'" />
      <DatasetView v-else-if="category === 'Datasets'" />
    </div>
  </div>
</template>
