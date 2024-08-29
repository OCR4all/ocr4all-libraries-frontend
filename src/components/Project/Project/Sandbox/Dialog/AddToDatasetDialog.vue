<script setup lang="ts">
import Skeleton from "primevue/skeleton";
import Column from "primevue/column";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import {useCustomFetch} from "@/composables/useCustomFetch";
import {IContainer} from "@/components/Project/project.interfaces";
import {FilterMatchMode} from "@primevue/core/api";

import IconAddToDataset from "~icons/fluent/stack-add-24-filled";
import {useToast} from "primevue/usetoast";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const key = ref()
const project = ref()
const sandbox = ref()

interface ITracking {
  user: string,
  created: string,
  updated: string
}

interface IDataset {
  id: string,
  name: string,
  description: string | null,
  keywords: string[] | null,
  tracking: ITracking,
  right: string | null
}

const datasets: Ref<IDataset[] | undefined> = ref()
const selectedDatasets: Ref<IDataset[]> = ref([])

const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  key.value = dialogRef?.value.data.key;
  project.value = dialogRef?.value.data.project;
  sandbox.value = dialogRef?.value.data.sandbox;
});

const { isFetching, error, data } = await useCustomFetch(
    `/data/collection/list`,
)
    .get()
    .json();
datasets.value = data.value.filter(function (container: IContainer) {
  return container.right !== null;
});

async function addToDataset(){
  for(const dataset of selectedDatasets.value){
    const payload = {
      track: key.value,
      "collection-id": dataset.id,
      keywords: true
    }
    await useCustomFetch(`/snapshot/collection/all/${project.value}/${sandbox.value}`).post(payload)
  }
  // Promise.all(requests).then((response) => {
  //   toast.add({
  //     severity: "success",
  //     summary: "Success",
  //     detail: "Ground Truth successfully added to datasets",
  //     life: 3000,
  //     group: "general",
  //   });
  //   dialogRef.value.close()
  // })
}
</script>
<template>
  <div class="grid grid-cols-1 gap-y-10">
    <DataTable
        ref="containerDataTable"
        v-model:selection="selectedDatasets"
        :value="datasets"
        :filters="filters"
        :paginator="true"
        :rows="5"
        :rows-per-page-options="[5, 10, 20, 50]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :row-hover="true"
    >
      <Column
          selection-mode="multiple"
          style="width: 3rem"
          :exportable="false"
      ></Column>
      <Column
          field="name"
          header="Dataset"
          sortable
      >
        <template #loading>
          <div
              class="align-items-center flex"
              :style="{
              height: '17px',
              'flex-grow': '1',
              overflow: 'hidden',
            }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
      </Column>
      <Column
          field="description"
          :header="
          $t('pages.repository.overview.dataview.list.column.description')
        "
      >
        <template #loading>
          <div
              class="align-items-center flex"
              :style="{
              height: '17px',
              'flex-grow': '1',
              overflow: 'hidden',
            }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
      </Column>
      <Column
          field="keywords"
          :header="$t('pages.repository.overview.dataview.list.column.keywords')"
      >
        <template #loading>
          <div
              class="align-items-center flex"
              :style="{
              height: '17px',
              'flex-grow': '1',
              overflow: 'hidden',
            }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
        <template #body="slotProps">
          <div class="flex space-x-1">
            <Tag v-for="keyword of slotProps.data.keywords" :key="keyword">{{
                keyword
              }}</Tag>
          </div>
        </template>
      </Column>
    </DataTable>
    <div class="place-self-center">
      <Button :disabled="selectedDatasets.length === 0" @click="addToDataset">
        <div class="flex space-x-2">
          <IconAddToDataset class="text-white self-center" />
          <p class="text-white">Import</p>
        </div>
      </Button>
    </div>
  </div>
</template>
