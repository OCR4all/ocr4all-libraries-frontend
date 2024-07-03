<script setup lang="ts">
import { datasetSchema } from "@/components/Repository/Datasets/Dialog/Schema/dataset";

const dialogRef = inject("dialogRef");

const data = ref()
const collection = ref()

onMounted(() => {
  data.value = dialogRef.value.data.set
  collection.value = dialogRef.value.data.collection
})

import { useCustomFetch } from "@/composables/useCustomFetch";

const schema = datasetSchema;

function editDataset(values, { setErrors }) {
  const payload = {
    metadata: [{
      id: data.value.id,
      name: data.value.name,
      keywords: data.value.keywords,
    }]
  }
  useCustomFetch(`/data/collection/set/update/${collection.value}`)
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        dialogRef.value.close();
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
      inputClass: 'p-button p-component',
    }"
    @submit="editDataset"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
