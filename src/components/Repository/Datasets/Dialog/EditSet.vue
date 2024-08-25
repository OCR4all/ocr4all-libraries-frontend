<script setup lang="ts">
import { setSchema } from "@/components/Repository/Datasets/Dialog/Schema/set";

const dialogRef = inject("dialogRef");

const data = ref();
const collection = ref();

onMounted(() => {
  data.value = dialogRef.value.data.set;
  collection.value = dialogRef.value.data.collection;
});

import { useCustomFetch } from "@/composables/useCustomFetch";

const schema = setSchema;

function editDataset(values, { setErrors }) {
  const payload = {
    metadata: [
      {
        id: values.id,
        name: values.name,
        keywords: values.keywords,
      },
    ],
  };
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
      inputClass: 'formkit-submit-btn',
    }"
    @submit="editDataset"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
