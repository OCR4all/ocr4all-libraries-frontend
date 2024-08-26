<script setup lang="ts">
import { useProjectCreationStore } from "@/stores/projectCreation.store";

import { useCustomFetch } from "@/composables/useCustomFetch";
import IconImageImport from "~icons/lucide/image-plus";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast()

const store = useProjectCreationStore();

const isLoading = ref(false)

const imageSelector = ref()

async function importFolios() {
  const selection = imageSelector.value.get()
  const requests = []

  for (const [key, value] of Object.entries(selection)) {
    if (value === true) {
      requests.push(useCustomFetch(
        `/project/folio/import/all/${store.projectId}?id=${key}`,
      ).json)
    } else if (value.length > 0) {
      const payload = {
        ids: value,
      };
      requests.push(useCustomFetch(
        `/project/folio/import/list/${store.projectId}?id=${key}`,
      ).post(payload).json)
    }
  }
  isLoading.value = true
  try{
    Promise.all(requests).then(async (response) => {
      await router.push(`/project/${store.projectId}/view`);
    })
  }catch(error){
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Folios couldn't get imported",
      life: 3000,
      group: "general",
    });
    await router.push(`/project/${store.projectId}/view`);
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center space-y-10 dark:text-surface-100 sm:p-12"
  >
    <h2
      class="mb-2 text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.new.components.images.directive") }}
    </h2>
  </div>
  <div class="grid grid-cols-1 justify-center gap-y-4">
    <ImageSelector ref="imageSelector" />
    <div class="place-self-center">
      <Button v-if="imageSelector" :disabled="Object.keys(imageSelector.selectedFolios).length === 0" @click="importFolios">
        <div class="flex space-x-2">
          <IconImageImport class="text-white self-center" />
          <p class="text-white">Import</p>
        </div>
      </Button>
    </div>
  </div>
</template>
