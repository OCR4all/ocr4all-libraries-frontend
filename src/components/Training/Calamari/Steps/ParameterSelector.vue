<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import { buildProcessorSchema } from "@/components/ProcessSelector/utils";

const processor = "de.uniwuerzburg.zpd.ocr4all.application.calamari.spi.training.CalamariTraining"

const data = ref()
const schema = ref([])

useCustomFetch(`/spi/entity/${processor}`)
    .get()
    .json()
    .then((response) => {
      console.log(response.data.value)
      buildProcessorFormSchema(response.data.value, 2);
    });

function buildProcessorFormSchema(data, cols: number) {
  schema.value = buildProcessorSchema(data, cols);
}

function getParameters(){
  return data.value
}

defineExpose({
  getParameters,
});
</script>
<template>
  <FormKit
      id="parameterForm"
      ref="parameterForm"
      v-model="data"
      type="form"
      :actions="false"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
