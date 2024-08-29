<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import { useCustomFetch } from "@/composables/useCustomFetch";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const toast = useToast();
const data = ref();

onMounted(() => {
  data.value = dialogRef?.value.data;
});

async function deleteDataset() {
  for (const dataset of data.value) {
    await useCustomFetch(`/data/collection/remove?id=${dataset.id}`)
      .get()
      .then((response) => {
        if (response.error.value) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error while trying to delete datasets",
            life: 3000,
            group: "general",
          });
        } else {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Datasets deleted.",
            life: 3000,
            group: "general",
          });
          dialogRef?.value.close();
        }
      });
  }
}
</script>
<template>
  <div class="m-4">
    <p class="text-lg text-surface-950 dark:text-surface-0">
      Do you really want to delete this dataset?
    </p>
  </div>
  <ActionButton rounded size="large" @click="dialogRef?.close()">
    <i class="pi pi-times"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.cancel") }}
  </ActionButton>
  <ActionButton rounded type="delete" size="large" @click="deleteDataset">
    <i class="pi pi-check"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.save") }}
  </ActionButton>
</template>
