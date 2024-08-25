<script setup lang="ts">
import { modelSchema } from "@/components/Repository/Models/Dialog/Schema/modelSchema";

const dialogRef = inject("dialogRef");

const data = ref();

onMounted(() => {
  data.value = dialogRef.value.data;
});

import { useCustomFetch } from "@/composables/useCustomFetch";

const schema = modelSchema;

function editModel(values, { setErrors }) {
  const payload = {
    name: data.value.name,
    description: data.value.description,
    keywords: data.value.keywords,
  };
  useCustomFetch(`/assemble/model/update?id=${data.value.id}`)
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
    id="editModelForm"
    v-model="data"
    type="form"
    :submit-attrs="{
      inputClass: 'formkit-submit-btn',
    }"
    @submit="editModel"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
