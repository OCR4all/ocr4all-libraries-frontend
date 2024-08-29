<script setup lang="ts">
import { datasetSchema } from "@/components/Repository/Datasets/Dialog/Schema/dataset";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");
import { useCustomFetch } from "@/composables/useCustomFetch";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const schema = datasetSchema;
const data = ref();

function createDataset(values, { setErrors }) {
  const payload = {
    name: data.value.name,
    description: data.value.description,
    keywords: data.value.keywords,
  };
  useCustomFetch(`/data/collection/create`)
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        dialogRef?.value.close();
      }
    });
}
</script>
<template>
  <FormKit
    id="createGroupForm"
    v-model="data"
    type="form"
    :submit-attrs="{
      inputClass: 'formkit-submit-btn',
    }"
    @submit="createDataset"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
