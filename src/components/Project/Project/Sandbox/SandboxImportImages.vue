<script setup lang="ts">
import { useSandboxCreationStore } from "@/stores/sandboxCreation.store";
import PickList from "primevue/picklist";
import Image from "primevue/image";

const emit = defineEmits(["next"]);

import { useCustomFetch } from "@/composables/useCustomFetch";
import { FilterMatchMode } from "@primevue/core/api";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";

const store = useSandboxCreationStore();

interface IDerivative {
  width: number;
  height: number;
}

interface IDerivatives {
  thumbnail: IDerivative;
  detail: IDerivative;
  best: IDerivative;
}

interface IFolio {
  date: string;
  derivatives: IDerivatives;
  user: string;
  keywords: string[];
  id: string;
  name: string;
  format: string;
  pageXMLType: null | string;
}

const router = useRouter();
const project = router.currentRoute.value.params.project;

const folios = ref([]);
const selectedFolios: Ref<IFolio[]> = ref([]);

const imageMap = ref(new Map());

async function importImages() {
  if (selectedFolios.value) {
    store.selectedImages = Array.from(
      selectedFolios.value.map((folio) => folio.id),
    );
    emit("next");
  }
}

async function loadDetail(id: string) {
  await useCustomFetch(`/project/folio/derivative/best/${project}?id=${id}`)
    .get()
    .blob()
    .then((blob) => {
      console.log(blob);
      imageMap.value.get(id).detail = useObjectUrl(blob.data.value);
    });
}

const folioData = await useCustomFetch(`/project/folio/list/${project}`)
  .get()
  .json();
for (const folio of folioData.data.value) {
  useCustomFetch(
    `/project/folio/derivative/thumbnail/${project}?id=${folio.id}`,
  )
    .get()
    .blob()
    .then((blob) => {
      imageMap.value.set(folio.id, {
        thumbnail: useObjectUrl(blob.data.value),
        detail: null,
      });
    });
}
folios.value = folioData.data.value;

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.EQUALS },
  keywords: { value: null, matchMode: FilterMatchMode.IN },
});
</script>

<template>
  <section
    v-if="folios.length > 0"
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
    <div
      class="rounded-xl border border-surface-200 p-2 dark:border-surface-700"
    >
      <DataTable
        :value="folios"
        v-model:selection="selectedFolios"
        v-model:filters="filters"
        paginator
        resizableColumns
        columnResizeMode="expand"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <template #header>
          <Fluid>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search"
              />
            </IconField>
          </Fluid>
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column>
          <template #body="{ data }">
            <Image v-if="imageMap.get(data.id)" :alt="data.name" preview>
              <template #previewicon>
                <i
                  class="pi pi-search"
                  style="padding: 100%"
                  @click="loadDetail(data.id)"
                ></i>
              </template>
              <template #image>
                <img
                  :src="imageMap.get(data.id).thumbnail"
                  width="40"
                  alt="image"
                />
              </template>
              <template #preview="slotProps">
                <img
                  :src="imageMap.get(data.id).detail"
                  class="max-h-screen"
                  alt="preview"
                  :style="slotProps.style"
                />
              </template>
            </Image>
            <Skeleton v-else height="2rem"></Skeleton>
          </template>
        </Column>
        <Column sortable field="name" header="Name"></Column>
        <Column field="keywords" header="Keywords"></Column>
      </DataTable>
    </div>
    <button
      :disabled="selectedFolios.length === 0"
      class="mt-12 inline-block rounded-md bg-primary-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-blue-400 md:text-base"
      @click="importImages"
    >
      Select
    </button>
  </section>
  <section v-else>
    <h2
      class="mb-8 text-center text-lg font-bold text-surface-700 dark:text-surface-200 sm:text-lg md:text-lg"
    >
      Project has no image associated yet.
    </h2>
    <Button> Import Images </Button>
  </section>
</template>
