<script setup lang="ts">
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useCustomFetch } from "@/composables/useCustomFetch";
import Toolbar from "primevue/toolbar";
import ImageCard from "@/components/Project/Project/ImageCard.vue";
import IconImageImport from "~icons/lucide/image-plus";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const folios = ref([]);
async function refresh() {
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

async function importFolios(data) {
  for (const [key, value] of Object.entries(data)) {
    if (value === true) {
      await useCustomFetch(
        `/project/folio/import/all/${project}?id=${key}`,
      ).get();
    } else if (value.length > 0) {
      const payload = {
        ids: value,
      };
      await useCustomFetch(
        `/project/folio/import/list/${project}?id=${key}`,
      ).post(payload);
    }
  }
  imageImportDialogVisible.value = false;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Folios succesfully imported into project",
    life: 3000,
    group: "general",
  });
  await refresh();
}

refresh();

const imageImportDialogVisible = ref(false);
</script>
<template>
  <Dialog
    v-model:visible="imageImportDialogVisible"
    maximizable
    modal
    @close="imageImportDialogVisible = false"
  >
    <template #container="{ closeCallback }">
      <div class="rounded-md bg-surface-50 p-4 dark:bg-surface-700">
        <ImageSelector @import-folios="importFolios" />
        <div class="flex justify-center">
          <button
            @click="closeCallback"
            class="w-64 justify-self-center bg-primary-500 p-2 font-semibold text-surface-50 hover:bg-primary-600 disabled:bg-primary-200"
          >
            Close
          </button>
        </div>
      </div>
    </template>
  </Dialog>
  <div class="@container/section">
    <Toolbar class="mb-4">
      <template #start>
        <Button
          v-tooltip.top="'Import Images'"
          text
          @click="imageImportDialogVisible = true"
        >
          <IconImageImport class="text-black dark:text-white" />
        </Button>
      </template>
    </Toolbar>
    <ComponentContainer>
      <div
        v-if="folios.length"
        class="grid grid-cols-1 justify-between gap-x-2 gap-y-3 @[550px]/section:grid-cols-2 @[800px]/section:grid-cols-3 @[1050px]/section:grid-cols-4"
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
    </ComponentContainer>
  </div>
</template>
