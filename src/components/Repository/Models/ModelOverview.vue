<script setup lang="ts">
import InputText from "primevue/inputtext";
import Skeleton from "primevue/skeleton";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import {useCustomFetch} from "@/composables/useCustomFetch";
import {IContainer} from "@/components/Project/project.interfaces";
import {useToast} from "primevue/usetoast";
import {FilterMatchMode} from "@primevue/core/api";

const isRefetching = ref()

const toast = useToast()
const models = ref()
const selectedModels = ref()


async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(
      `/assemble/model/list`,
  )
      .get()
      .json();
  console.log(data.value)
  if(error.value){
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value,
      life: 3000,
    });
  }else{
    models.value = data.value.filter(function (container: IContainer){
      return container.right !== null
    })
  }
  setTimeout(function () {
    isRefetching.value = isFetching.value;
  }, 500);
}


const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

refetch()
</script>
<template>
  <ComponentContainer border>
    <DataTable
        ref="containerDataTable"
        v-model:selection="selectedModels"
        :value="models"
        :filters="filters"
        lazy
        :paginator="true"
        :rows="5"
        :rows-per-page-options="[5, 10, 20, 50]"
        :row-hover="true"
    >
      <template #header>
        <div
            class="sm:justify-items-between grid grid-cols-1 items-center justify-items-start gap-2 sm:grid-cols-2"
        >
          <h4 class="m-0 font-bold">Manage datasets</h4>
          <div class="flex justify-self-start sm:justify-self-end">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                  v-model="filters['global'].value"
                  placeholder="Search"
              />
            </IconField>
          </div>
        </div>
      </template>
      <Column
          selection-mode="multiple"
          style="width: 3rem"
          :exportable="false"
      ></Column>
      <Column
          field="name"
          :header="$t('pages.repository.overview.dataview.list.column.name')"
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
        <template #body="{ data }">
          <p
              class="cursor-pointer hover:underline"
              @click="openModel(data.id, data.name)"
          >
            {{ data.name }}
          </p>
        </template>
      </Column>
      <Column field="engine.type" header="Engine" />
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
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <Button
              type="button"
              text
              severity="secondary"
              @click="toggle($event, data)"
          >
            <i class="pi pi-ellipsis-h text-black dark:text-white" />
          </Button>
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>