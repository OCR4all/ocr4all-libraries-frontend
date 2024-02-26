<script setup lang="ts">
import { useSandboxCreationStore } from "@/stores/sandboxCreation.store";
import PickList from "primevue/picklist";
import Image from "primevue/image";

const emit = defineEmits(["next"]);

import { useCustomFetch } from "@/composables/useCustomFetch";

const store = useSandboxCreationStore();

const router = useRouter();
const project = router.currentRoute.value.params.project;

const folios = ref([]);
async function importImages() {
  store.selectedImages = Array.from(folios.value[1].map((folio) => folio.id));
  emit("next");
}

const folioData = await useCustomFetch(`/project/folio/list/${project}`)
  .get()
  .json();
const imageData = [];
for (const folio of folioData.data.value) {
  const imageEntry = { id: folio.id, name: folio.name };
  await useCustomFetch(
    `/project/folio/derivative/thumbnail/${project}?id=${folio.id}`,
  )
    .get()
    .blob()
    .then((blob) => {
      imageEntry["thumbnail"] = useObjectUrl(blob.data.value);
    });
  await useCustomFetch(
    `/project/folio/derivative/best/${project}?id=${folio.id}`,
  )
    .get()
    .blob()
    .then((blob) => {
      imageEntry["best"] = useObjectUrl(blob.data.value);
    });
  imageData.push(imageEntry);
}
folios.value = [imageData, []];
</script>

<template>
  <section
    class="flex flex-col items-center justify-center dark:text-surface-100"
  >
    <h2
      class="mb-2 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.sandbox.images.heading") }}
    </h2>
    <h2
      class="mb-8 text-center text-lg font-bold text-surface-700 dark:text-surface-200 sm:text-lg md:text-lg"
    >
      {{ $t("pages.projects.sandbox.images.directive") }}
    </h2>
    <PickList v-model="folios" listStyle="height:342px" dataKey="id">
      <template #sourceheader> Available </template>
      <template #targetheader> Selected </template>
      <template #item="slotProps">
        <div class="group flex flex-wrap justify-center gap-3 p-2">
          <Image alt="Image" preview>
            <template #indicatoricon>
              <i class="pi pi-eye"></i>
            </template>
            <template #image>
              <img :src="slotProps.item.thumbnail" alt="image" />
            </template>
            <template #preview="slotPropsImage">
              <img
                :src="slotProps.item.best"
                alt="preview"
                :style="slotPropsImage.style"
                @click="slotPropsImage.onClick"
              />
            </template>
          </Image>
          <div class="flex-column flex flex-1 justify-center   gap-2">
            <span
              class="font-bold dark:text-white"
              >{{ slotProps.item.name }}</span
            >
          </div>
        </div>
      </template>
    </PickList>
    <button
      :disabled="folios[1].length === 0"
      class="mt-12 inline-block rounded-md bg-primary-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-blue-400 md:text-base"
      @click="importImages"
    >
      Select
    </button>
  </section>
</template>
