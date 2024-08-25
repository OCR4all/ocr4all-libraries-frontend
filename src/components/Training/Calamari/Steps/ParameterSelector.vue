<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import { buildProcessorSchema } from "@/components/ProcessSelector/utils";

const processor =
  "de.uniwuerzburg.zpd.ocr4all.application.calamari.spi.training.CalamariTraining";

const data = ref();
const schema = ref([]);

const registry = ref()

useCustomFetch(`/spi/entity/${processor}`)
  .get()
  .json()
  .then((response) => {
    buildProcessorFormSchema(response.data.value, 2);
    registry.value = buildRegistry(response.data.value)
  });

function buildRegistry(data){
  const registry = {}
  for(const entry of data.entries){
    registry[entry.argument] = entry.type
  }

  return registry
}

function buildProcessorFormSchema(data, cols: number) {
  schema.value = buildProcessorSchema(data, cols);
}

function getParameters() {
  const booleans = [];
  const decimals = [];
  const integers = [];
  const selects = [];
  const strings = [];

  for(const [key, value] of Object.entries(data.value)){
    const processorType = registry.value[key]
    if(value){
      switch (processorType) {
        case "boolean":
          booleans.push({
            argument: key,
            value: value,
          });
          break;
        case "decimal":
          decimals.push({
            argument: key,
            value: value,
          });
          break;
        case "integer":
          integers.push({
            argument: key,
            value: value,
          });
          break;
        case "select":
          selects.push({
            argument: key,
            values: [value],
          });
          break;
        case "string":
          strings.push({
            argument: key,
            value: value,
          });
          break;
      }
    }
  }
  return {
    booleans: booleans,
    decimals: decimals,
    integers: integers,
    selects: selects,
    strings: strings
  }
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
    :submit-attrs="{
          inputClass: 'formkit-submit-btn',
        }"
    :actions="false"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
