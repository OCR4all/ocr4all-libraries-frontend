<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { getColor, getPalette, setPrimaryColors } from "@/utils/colors";
import { appearance } from "@/components/Settings/Schema/appearance";

const toast = useToast();
const isDark = useDark();

const schema = appearance;
const data = ref({
  darkMode: useDark(),
});

function updateAppearance(values, { setErrors }) {
  const primary = getColor([
    values.primary.r,
    values.primary.g,
    values.primary.b,
  ]);
  const palette = getPalette(primary);
  try {
    setPrimaryColors(palette);
    isDark.value = values.darkMode;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  }
}
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col space-y-4 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">Appearance</h1>
    <FormKit
      id="form"
      v-model="data"
      type="form"
      submit-label="Save all"
      :submit-attrs="{
        inputClass: '',
      }"
      @submit="updateAppearance"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
  </div>
</template>
