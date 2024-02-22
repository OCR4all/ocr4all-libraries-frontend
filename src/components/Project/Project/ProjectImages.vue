<script setup lang="ts">
import Dialog from "primevue/dialog";
import Image from "primevue/image";
import Button from "primevue/button";

import { useCustomFetch } from "@/composables/useCustomFetch";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import Skeleton from "primevue/skeleton";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const activeIndex = ref(0);

const folioData = await useCustomFetch(`/project/folio/list/${project}`)
  .get()
  .json();
const folios = ref([]);

for (const folio of folioData.data.value) {
  fetchImages(folio);
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
    img: image,
    thumbnail: thumbnail,
  });
}

const responsiveOptions = ref([
  {
    breakpoint: "991px",
    numVisible: 4,
  },
  {
    breakpoint: "767px",
    numVisible: 3,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
  },
]);

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
        <ImageSelector />
      </div>
      <Button label="Close" icon="pi pi-check" @click="closeCallback" />
    </template>
  </Dialog>
  <div>
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
      class="grid grid-cols-4 items-center justify-center space-y-2"
    >
      <Suspense>
        <Image
          v-for="folio in folios"
          :key="folio.id"
          alt="Image"
          class="justify-self-center"
          preview
        >
          <template #indicatoricon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img :src="folio.thumbnail" alt="image" />
          </template>
          <template #preview="slotProps">
            <img
              :src="folio.img"
              alt="preview"
              :style="slotProps.style"
              @click="slotProps.onClick"
            />
          </template>
        </Image>
        <template #fallback>
          <Skeleton animation="wave" size="20rem"></Skeleton>
        </template>
      </Suspense>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center dark:text-gray-100"
    >
      {{ $t("pages.projects.project.images.no-images") }}
    </div>
  </div>
</template>
