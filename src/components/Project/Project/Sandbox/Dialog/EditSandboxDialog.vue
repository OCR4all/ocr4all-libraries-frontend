<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { sandboxMetadataSchema } from "@/components/Project/Project/Sandbox/Dialog/Schema/sandboxMetadataSchema";
import { useToast } from "primevue/usetoast";

const dialogRef = inject("dialogRef");
const toast = useToast();

const schema = sandboxMetadataSchema;
const data = ref();
const project = ref()

import { useI18n } from "vue-i18n";
const { t } = useI18n();

onMounted(() => {
  data.value = dialogRef.value.data.sandbox;
  project.value = dialogRef.value.data.project
});

async function submit(values, { setErrors }) {
  const payload = {
    id: values.id,
    name: values.name,
    description: values.description,
    state: values.state,
    keywords: values.keywords,
  };
  const response = await useCustomFetch(`/sandbox/update/${project.value}`)
    .post(payload)
    .json();
  console.log(response.error)
  if (!response.error.value) {
    toast.add({
      severity: "success",
      summary: t(
        "pages.projects.project.information.toasts.update.success.summary",
      ),
      detail: t(
        "pages.projects.project.information.toasts.update.success.detail",
      ),
      life: 3000,
      group: "general",
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong.",
      life: 3000,
      group: "general",
    });
  }
  dialogRef.value.close();
}
</script>
<template>
  <FormKit
    id="projectInformationForm"
    ref="form"
    v-model="data"
    type="form"
    :submit-attrs="{
      inputClass: 'formkit-submit-btn',
    }"
    @submit="submit"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
