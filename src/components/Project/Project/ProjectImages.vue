<script setup lang="ts">
import Dialog from "primevue/dialog";
import Image from "primevue/image";
import Button from "primevue/button";

import { useCustomFetch } from "@/composables/useCustomFetch";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import Skeleton from "primevue/skeleton";
import ImageCard from "@/components/Project/Project/ImageCard.vue";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const folios = ref([]);
async function refresh(){
  const folioData = await useCustomFetch(`/project/folio/list/${project}`)
    .get()
    .json();

  for (const folio of folioData.data.value) {
    await fetchImages(folio);
  }
}

async function fetchImages(folio) {
  const thumbnailBlob = await useCustomFetch(
    `/project/folio/derivative/thumbnail/${project}?id=${folio.id}`,
  )
    .get()
    .blob();
  const thumbnail = useObjectUrl(thumbnailBlob.data.value);

  const imageBlob = await useCustomFetch(
    `/project/folio/derivative/best/${project}?id=${folio.id}`,
  )
    .get()
    .blob();
  const image = useObjectUrl(imageBlob.data.value);
  folios.value.push({
    name: folio.name,
    id: folio.id,
    size: folio.size,
    format: folio.format,
    img: image,
    thumbnail: thumbnail,
  });
}

async function importFolios(data){
  for(const [key, value] of Object.entries(data)){
    if(value === true){
      await useCustomFetch(
        `/project/folio/import/all/${project}?id=${key}`
      ).get()
    }else if(value.length > 0){
      const payload = {
        "ids": value
      }
      await useCustomFetch(
        `/project/folio/import/list/${project}?id=${key}`
      ).post(payload)
    }
  }
  imageImportDialogVisible.value = false
  await refresh()
}

refresh()

const imageImportDialogVisible = ref(false);
</script>
<template>
  <Dialog
    v-model:visible="imageImportDialogVisible"
    maximizable
    modal
    @close="imageImportDialogVisible = false"
    :pt="{
      root: 'border-none w-5/6 h-4/12',
      mask: {
        style: 'backdrop-filter: blur(2px)',
      },
    }"
  >
    <template #container="{ closeCallback }">
      <div class="rounded-md bg-surface-50 p-4 dark:bg-surface-700">
        <ImageSelector
          @import-folios="importFolios"
        />
      </div>
      <Button label="Close" icon="pi pi-check" @click="closeCallback" />
    </template>
  </Dialog>
  <div class="@container/section">
    <Toast />
    <Toolbar class="mb-4">
      <template #start>
        <div class="my-2 space-x-2">
          <button
            type="button"
            class="rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            @click="imageImportDialogVisible = true"
          >
            Import Images
          </button>
        </div>
      </template>
    </Toolbar>
    <div
      v-if="folios.length"
      class="grid grid-cols-1 @[550px]/section:grid-cols-2 @[800px]/section:grid-cols-3 @[1050px]/section:grid-cols-4 justify-between gap-x-2 gap-y-3"
    >
      <ImageCard
        v-for="folio in folios"
        :key="folio.id"
        :name="folio.name"
        :thumb="folio.thumbnail"
        :img="folio.img"
        :size="folio.size"
        :format="folio.format"
      />
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center dark:text-surface-100"
    >
      {{ $t("pages.projects.project.images.no-images") }}
    </div>
  </div>
</template>
