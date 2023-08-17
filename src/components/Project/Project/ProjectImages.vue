<script setup lang="ts">
import Galleria from "primevue/galleria";
import Image from "primevue/image";
import Button from "primevue/button";

import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const activeIndex = ref(0);

const folioData = await useCustomFetch(`/folio/list/${project}`)
  .post({ identifiers: [] })
  .json();
const folios = ref([]);
for (const folio of folioData.data.value) {
  const thumbnailBlob = await useCustomFetch(
    `/folio/derivative/thumbnail/${project}?id=${folio.id}`
  )
    .get()
    .blob();
  const thumbnail = useObjectUrl(thumbnailBlob.data.value);

  const imageBlob = await useCustomFetch(
    `/folio/derivative/best/${project}?id=${folio.id}`
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

const next = () => {
  activeIndex.value =
    activeIndex.value === folios.value.length - 1 ? 0 : activeIndex.value + 1;
};
const prev = () => {
  activeIndex.value = Math.max(activeIndex.value - 1, 0);
};
</script>
<template>
  <div>
    <div v-if="folios.length" class="flex flex-col items-center justify-center">
      <div class="mb-5 space-x-6">
        <Button
          :disabled="activeIndex === 0"
          icon="pi pi-arrow-left"
          @click="prev"
        />
        <Button
          :disabled="activeIndex === folios.length - 1"
          icon="pi pi-arrow-right"
          @click="next"
        />
      </div>
      <Galleria
        v-model:activeIndex="activeIndex"
        :value="folios"
        :responsiveOptions="responsiveOptions"
        :numVisible="5"
        :circular="true"
        :showThumbnailNavigators="false"
        :pt="{
          root: { class: 'max-w-[640px]' },
        }"
      >
        <template #item="slotProps">
          <Image
            :src="slotProps.item.img"
            :pt="{
              image: { class: '!h-[60vh]' },
            }"
            preview
          />
        </template>
        <template #thumbnail="slotProps">
          <img
            :src="slotProps.item.thumbnail"
            style="display: block"
            alt="Thumbnail"
          />
        </template>
      </Galleria>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center dark:text-gray-100"
    >
      {{ $t("pages.projects.project.images.no-images") }}
    </div>
  </div>
</template>
