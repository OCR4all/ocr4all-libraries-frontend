<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { projectInformationSchema } from "@/components/Project/Project/Dialog/Schemas/projectInformationSchema";
import { useToast } from "primevue/usetoast";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");
const toast = useToast();

const schema = projectInformationSchema;
const data = ref();

import { useI18n } from "vue-i18n";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
const { t } = useI18n();

onMounted(() => {
  data.value = dialogRef?.value.data;
});

async function submitProjectInformationChange(values, { setErrors }) {
  const payload = {
    id: values.id,
    name: values.name,
    description: values.description,
    state: values.state,
    keywords: values.keywords,
  };
  const { isFetching, error, data } = await useCustomFetch(`/project/update`)
    .post(payload)
    .json();
  if (!error.value) {
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
  dialogRef?.value.close();
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
    @submit="submitProjectInformationChange"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
