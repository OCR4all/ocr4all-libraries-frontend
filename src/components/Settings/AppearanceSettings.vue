<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { getColor, getPalette } from "@/utils/palette";
import { appearance } from "@/components/Settings/Schema/appearance";
import { updatePrimaryPalette } from '@primevue/themes';

const toast = useToast();
const isDark = useDark()

const schema = appearance
const data = ref({
  darkMode: useDark()
})

function updateAppearance(values, { setErrors }) {
  const primary = getColor([values.primary.r, values.primary.g, values.primary.b])
  const palette = getPalette(primary)
  try{
    updatePrimaryPalette({
      50: palette[0],
      100: palette[1],
      200: palette[2],
      300: palette[3],
      400: palette[4],
      500: palette[5],
      600: palette[6],
      700: palette[7],
      800: palette[8],
      900: palette[9],
      950: palette[10]
    });
    isDark.value = values.darkMode
  }catch(error){
    toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
  }
}

</script>
<template>
  <div
    class="flex h-full flex-1 flex-col rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900 space-y-4"
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
