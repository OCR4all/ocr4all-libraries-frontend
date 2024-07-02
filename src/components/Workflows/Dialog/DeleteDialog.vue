<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";
import {useI18n} from "vue-i18n";

const i18n = useI18n();

const dialogRef = inject("dialogRef");
const toast = useToast()

const data = ref();

onMounted(() => {
  data.value = dialogRef.value.data.data;
});

async function deleteWorkflow() {
  await useCustomFetch(
    `/workflow/remove/${data.value.id}`,
  )
    .get()
    .json();
  toast.add({
    severity: "success",
    summary: i18n.t("pages.workflows.toasts.remove.success.summary"),
    detail: i18n.t("pages.workflows.toasts.remove.success.detail"),
    life: 3000,
  });
  dialogRef.value.close();
}
</script>
<template>
  <p class="pb-5 dark:text-surface-200">
    {{ $t("pages.workflows.dialog.delete.content") }}
  </p>
  <ActionButton type="delete" size="large" rounded @click="deleteWorkflow">
    {{ $t("pages.workflows.dialog.delete.button.delete") }}
  </ActionButton>
</template>
