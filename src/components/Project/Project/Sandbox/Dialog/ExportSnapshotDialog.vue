<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");
import { exportSnapshotSchema } from "@/components/Project/Project/Sandbox/Dialog/Schema/exportSnapshotSchema";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const project = ref();
const sandbox = ref();
const track = ref();

const data = ref({
  includeImages: false,
  normalizeFilenames: true,
});

const schema = exportSnapshotSchema;

onMounted(() => {
  project.value = dialogRef?.value.data.project;
  sandbox.value = dialogRef?.value.data.sandbox;
  track.value = dialogRef?.value.data.track;
});

async function submitExportSnapshot(values, { setErrors }) {
  const payload = {
    track: track.value,
    "normalize-filenames": values.normalizeFilenames,
    "source-images": values.includeImages,
  };
  useCustomFetch(`/snapshot/export/${project.value}/${sandbox.value}`)
    .post(payload)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${project.value}_${sandbox.value}_${track.value.toString().replace(",", "_")}.zip`,
      );
      document.body.appendChild(link);
      link.click();
      dialogRef?.value.close();
    });
}
</script>
<template>
  <FormKit
    id="projectInformationForm"
    ref="form"
    v-model="data"
    type="form"
    :submit-attrs="{
      inputClass: 'hidden',
    }"
    @submit="submitExportSnapshot"
  >
    <FormKitSchema :schema="schema" :data="data" />
    <Button type="submit" />
  </FormKit>
</template>
