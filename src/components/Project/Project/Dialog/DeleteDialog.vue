<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const dialogRef = inject("dialogRef");

import { useI18n } from "vue-i18n";
const { t } = useI18n();

async function deleteProject() {
  const { isFetching, error, data } = await useCustomFetch(
    `/project/remove?id=${dialogRef.value.data.id}`,
  )
    .get()
    .json();
  if (!error) {
    toast.add({
      severity: "success",
      summary: t(
        "pages.projects.project.information.toasts.update.success.summary",
      ),
      detail: t(
        "pages.projects.project.information.toasts.update.success.detail",
      ),
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong.",
      life: 3000,
    });
  }
  dialogRef.value.close();
}
</script>
<template>
  <p class="pb-5 dark:text-surface-200">
    {{ $t("pages.projects.project.information.modals.delete.content") }}
  </p>
  <button
    type="button"
    class="mb-2 mr-2 rounded-md border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-500 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
    @click="dialogRef.close()"
  >
    {{ $t("pages.projects.project.information.modals.delete.buttons.cancel") }}
  </button>
  <button
    type="button"
    class="mb-2 mr-2 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
    @click="deleteProject"
  >
    {{ $t("pages.projects.project.information.modals.delete.buttons.delete") }}
  </button>
</template>
