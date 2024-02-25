<script setup lang="ts">
import { CloudArrowUpIcon, FolderPlusIcon } from "@heroicons/vue/24/outline";

import { useProjectCreationStore } from "@/stores/projectCreation.store";

import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();

const store = useProjectCreationStore();

async function importFolios(data){
    for(const [key, value] of Object.entries(data)){
      if(value === true){
        await useCustomFetch(
          `/project/folio/import/all/${store.projectId}?id=${key}`
        ).get()
      }else if(value.length > 0){
        const payload = {
          "ids": value
        }
        await useCustomFetch(
          `/project/folio/import/list/${store.projectId}?id=${key}`
        ).post(payload)
      }
    }
  await router.push("/project/overview");
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
  <ImageSelector
    @import-folios="importFolios"
  />
</template>
