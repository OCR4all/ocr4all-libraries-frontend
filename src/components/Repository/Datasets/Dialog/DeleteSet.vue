<script setup lang="ts">
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const data = ref();
const collection = ref();

const toast = useToast()

onMounted(() => {
  data.value = dialogRef?.value.data.data;
  collection.value = dialogRef?.value.data.collection;
});

async function deleteDataset() {
  for(const entry of data.value){
    await useCustomFetch(
      `/data/collection/set/remove/entity/${collection.value}?id=${entry.id}`,
    ).get()
  }
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Sets were removed",
    life: 3000,
    group: "general",
  });
  dialogRef?.value.close()
}
</script>
<template>
  <div class="m-4">
    <p class="text-lg text-surface-950 dark:text-surface-0">
      Do you really want to delete this set?
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
