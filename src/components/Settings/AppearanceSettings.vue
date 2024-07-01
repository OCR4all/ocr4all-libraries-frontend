<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { appearance } from "@/components/Settings/Schema/appearance";

const toast = useToast();

const schema = appearance
const data = ref()

function updateAppearance(values, { setErrors }) {
  try{
    console.log()
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
