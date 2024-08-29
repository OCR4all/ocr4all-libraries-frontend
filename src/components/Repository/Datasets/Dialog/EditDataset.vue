<script setup lang="ts">
import { datasetSchema } from "@/components/Repository/Datasets/Dialog/Schema/dataset";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const data = ref();

onMounted(() => {
  data.value = dialogRef?.value.data.data;
  console.log(data.value);
});

import { useCustomFetch } from "@/composables/useCustomFetch";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const schema = datasetSchema;

function editDataset(values, { setErrors }) {
  const payload = {
    name: data.value.name,
    description: data.value.description,
    keywords: data.value.keywords,
  };
  useCustomFetch(`/data/collection/update?id=${data.value.id}`)
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
    @submit="editDataset"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
