<script setup lang="ts">
import { setFontSize, setGrayscale } from "@/utils/a11n";

const fontScaling = useStorage("ocr4all/frontend/a11n/font-size", {
  name: "Medium",
  value: "14px",
});

const fontScalingOptions = ref([
  { name: "Small", value: "12px" },
  { name: "Medium", value: "14px" },
  { name: "Large", value: "16px" },
  { name: "Extra Large", value: "20px" },
]);

const font = useStorage("/ocr4all/frontend/a11n/font", {
  name: "Regular",
  value: "regular"
});

const fontOptions = ref([
  { name: "Regular", value: "regular" },
  { name: "Dyslexia", value: "dyslexia" },
]);

const grayScale = useStorage("/ocr4all/frontend/a11n/grayscale", {"name":"Deactivated","value":"grayscale(0)"});

const grayScaleOptions = ref([
  { name: "Deactivated", value: "grayscale(0)" },
  { name: "Activated", value: "grayscale(100%)" },
]);

watch(fontScaling, async (newFonzSize, _) => {
  setFontSize(newFonzSize)
})

watch(grayScale, async (newGrayscaleValue, _) => {
  setGrayscale(newGrayscaleValue)
})
</script>
<template>
  <div
      class="flex h-full flex-1 flex-col space-y-4 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">Accessibility</h1>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col space-y-2">
        <h2 class="text-sm font-bold text-black dark:text-white">Font Scaling</h2>
        <SelectButton
            v-model="fontScaling"
            :options="fontScalingOptions"
            option-label="name"
            :allow-empty="false"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <h2 class="text-sm font-bold text-black dark:text-white">Font</h2>
        <SelectButton
            v-model="font"
            :options="fontOptions"
            option-label="name"
            :allow-empty="false"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <h2 class="text-sm font-bold text-black dark:text-white">Grayscale</h2>
        <SelectButton
            v-model="grayScale"
            :options="grayScaleOptions"
            option-label="name"
            :allow-empty="false"
        />
      </div>
    </div>
  </div>
</template>
