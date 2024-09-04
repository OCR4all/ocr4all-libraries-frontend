<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import IconImageImport from "~icons/lucide/image-plus";
import { useToast } from "primevue/usetoast";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const toast = useToast();

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const project = ref();
const imageSelector = ref();

onMounted(() => {
  project.value = dialogRef?.value.data;
});

const isLoading = ref(false);

async function importFolios() {
  const selection = imageSelector.value.get();
  const requests = [];

  for (const [key, value] of Object.entries(selection)) {
    if (value === true) {
      requests.push(
        useCustomFetch(`/project/folio/import/all/${project.value}?id=${key}`)
          .json,
      );
    } else if (value.length > 0) {
      const payload = {
        ids: value,
      };
      requests.push(
        useCustomFetch(
          `/project/folio/import/list/${project.value}?id=${key}`,
        ).post(payload).json,
      );
    }
  }
  isLoading.value = true;
  try {
    Promise.all(requests).then((response) => {
      isLoading.value = false;
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Folios successfully imported into project",
        life: 3000,
        group: "general",
      });
      dialogRef?.value.close();
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Folios couldn't get imported",
      life: 3000,
      group: "general",
    });
  }
}
</script>
<template>
  <div class="grid grid-cols-1 justify-center">
    <ImageSelector ref="imageSelector" />
    <div class="place-self-center">
      <Button
        v-if="imageSelector"
        :disabled="Object.keys(imageSelector.selectedFolios).length === 0"
        @click="importFolios"
      >
        <div class="flex space-x-2">
          <IconImageImport class="self-center text-white" />
          <p class="text-white">Import</p>
        </div>
      </Button>
    </div>
  </div>
</template>
