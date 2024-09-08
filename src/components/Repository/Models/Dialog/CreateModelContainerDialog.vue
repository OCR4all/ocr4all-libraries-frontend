<script setup lang="ts">
import { modelSchema } from "@/components/Repository/Models/Dialog/Schema/modelSchema";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");
import { useCustomFetch } from "@/composables/useCustomFetch";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const schema = modelSchema;
const data = ref();

function createModelContainer(values, { setErrors }) {
  const payload = {
    name: data.value.name,
    description: data.value.description,
    keywords: data.value.keywords,
    "engine-type": data.value.engineType,
    "engine-version": data.value.engineVersion,
    "engine-name": data.value.engineName
  };
  useCustomFetch(`/assemble/model/create`)
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
    @submit="createModelContainer"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
