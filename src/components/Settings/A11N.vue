<script setup lang="ts">
import { setFontSize } from "@/utils/a11n"

const value = useStorage("/ocr4all/frontend/ui/a11n/font-size", {
  name: "Medium",
  value: "14px",
});
const options = ref([
  { name: "Small", value: "12px" },
  { name: "Medium", value: "14px" },
  { name: "Large", value: "16px" },
  { name: "Extra Large", value: "20px" },
]);

watch(value, (newValue) => {
  setFontSize(newValue.value)
});
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col space-y-4 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">Accessibility</h1>
    <h2 class="text-sm font-bold text-black dark:text-white">Font Scaling</h2>
    <SelectButton
      v-model="value"
      :options="options"
      optionLabel="name"
      :allow-empty="false"
      aria-labelledby="multiple"
    />
  </div>
</template>
