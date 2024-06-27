<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import { useCustomFetch } from "@/composables/useCustomFetch";

async function editWorkflow(id) {
  const { error, data } = await useCustomFetch(`/workflow/pull/${id}`)
    .get()
    .json();
  if (error.value) {
    toast.add({
      severity: "error",
      summary: t("pages.workflows.toasts.update.error.summary"),
      detail: t("pages.workflows.toasts.update.error.detail"),
      life: 3000,
    });
  } else {
    originalWorkflowName.value = data.value.metadata.label;
    workflowMetadata.value = data.value.metadata;
    workflowView.value = data.value.view;
    toggleEditDialog();
  }
}
</script>
<template>
  <div class="mx-auto grid grid-cols-6 gap-4">
    <div class="col-span-3 flex flex-col">
      <label
        for="text"
        class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
      >{{ $t("pages.workflows.dialog.edit.form.label.label") }}</label
      >
      <InputText v-model="workflowMetadata.label" type="text" />
      <Message v-show="labelTaken">{{
          $t("pages.workflows.dialog.edit.form.label.label-taken")
        }}</Message>
    </div>

    <div class="col-span-3 flex flex-col">
      <label
        for="last-name"
        class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
      >{{ $t("pages.workflows.dialog.edit.form.id.label") }}</label
      >
      <InputText disabled v-model="workflowMetadata.id" type="text" />
    </div>

    <div class="col-span-6 flex flex-col">
      <label
        for="message"
        class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
      >{{ $t("pages.workflows.dialog.edit.form.description.label") }}</label
      >
      <Textarea v-model="workflowMetadata.description" rows="5" cols="30" />
    </div>

    <div class="col-span-3 flex flex-col">
      <label
        for="last-name"
        class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
      >{{ $t("pages.workflows.dialog.edit.form.updated.label") }}</label
      >
      <InputText disabled v-model="workflowMetadata.date" type="text" />
    </div>

    <div class="flex items-center justify-between sm:col-span-6">
      <button
        class="inline-block rounded-md bg-red-400 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-red-300 transition duration-100 hover:bg-red-600 focus-visible:ring active:bg-red-700 md:text-base"
        @click="toggleDeleteDialog"
      >
        {{ $t("pages.workflows.dialog.edit.button.toggle-delete-dialog") }}
      </button>
    </div>
  </div>
</template>
