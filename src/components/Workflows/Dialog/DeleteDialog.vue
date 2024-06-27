<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

async function deleteWorkflow() {
  const { data } = await useCustomFetch(
    `/workflow/remove/${workflowMetadata.value.id}`,
  )
    .get()
    .json();
  toast.add({
    severity: "success",
    summary: t("pages.workflows.toasts.remove.success.summary"),
    detail: t("pages.workflows.toasts.remove.success.detail"),
    life: 3000,
  });
  refetch();
}
</script>
<template>
  <p class="pb-5 dark:text-surface-200">
    {{ $t("pages.workflows.dialog.delete.content") }}
  </p>
  <ActionButton size="large" rounded @click="toggleDeleteDialog">
    {{ $t("pages.workflows.dialog.delete.button.cancel") }}
  </ActionButton>
  <ActionButton type="delete" size="large" rounded @click="deleteWorkflow">
    {{ $t("pages.workflows.dialog.delete.button.delete") }}
  </ActionButton>
</template>
