<script setup lang="ts">
const dialogRef = inject("dialogRef");
import { useCustomFetch } from "@/composables/useCustomFetch";

const data = ref();

onMounted(() => {
  data.value = dialogRef.value.data;
});

function deleteDataset() {
  useCustomFetch(`/data/collection/remove?id=${data.value.id}`)
    .get()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value);
      } else {
        dialogRef.value.close();
      }
    });
}
</script>
<template>
  <div class="m-4">
    <p class="text-lg text-surface-950 dark:text-surface-0">
      Do you really want to delete this dataset?
    </p>
  </div>
  <ActionButton rounded size="large" @click="dialogRef.close()">
    <i class="pi pi-times"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.cancel") }}
  </ActionButton>
  <ActionButton rounded type="delete" size="large" @click="deleteDataset">
    <i class="pi pi-check"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.save") }}
  </ActionButton>
</template>
