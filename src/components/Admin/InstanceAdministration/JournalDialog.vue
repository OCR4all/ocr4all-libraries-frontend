<script setup lang="ts">
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
import { FilterMatchMode } from "@primevue/core/api";
import { UseTimeAgo } from "@vueuse/components";
import DataTable from "primevue/datatable";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");
const journal = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  user: { value: null, matchMode: FilterMatchMode.CONTAINS },
  message: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  journal.value = dialogRef?.value.data.journal;
});
</script>
<template>
  <DataTable
    v-model:filters="filters"
    scrollable
    scroll-height="75vh"
    resizableColumns
    columnResizeMode="expand"
    striped-rows
    :value="journal"
    :global-filter-fields="['user', 'level', 'message']"
    paginator
    :rows="5"
    :rows-per-page-options="[5, 10, 20, 50]"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Journal</span>
        <div class="flex gap-2">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
        </div>
      </div>
    </template>
    <Column sortable field="date" header="Date">
      <template #body="{ data }">
        <UseTimeAgo v-slot="{ timeAgo }" :time="Date.parse(data.date)">
          {{ timeAgo }}
        </UseTimeAgo>
      </template>
    </Column>
    <Column field="user" header="User"></Column>
    <Column field="info" header="Info"></Column>
    <Column field="message" header="Message"></Column>
    <Column field="succeed" header="Succeed"></Column>
    <Column field="source-status" header="Source Status"></Column>
    <Column field="target-status" header="Target Status"></Column>
  </DataTable>
</template>
