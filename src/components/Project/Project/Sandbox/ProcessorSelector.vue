<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import Tag from "primevue/tag";
import { FilterMatchMode, FilterOperator } from "primevue/api";

const availableProcessors = ref([]);
const filters = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    categories: { value: null, matchMode: FilterMatchMode.IN },
    description: { value: null, matchMode: FilterMatchMode.IN },
  };
};

initFilters();

const { data } = await useCustomFetch("/spi/list").get().json();
availableProcessors.value = data.value;
console.log(availableProcessors.value);
</script>
<template>
  <DataTable
    :value="availableProcessors"
    :filters="filters"
    filterDisplay="menu"
    :globalFilterFields="['name', 'categories', 'description']"
    paginator
  >
    <template #header>
      <div class="justify-content-between flex">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          @click="clearFilter()"
        />
        <IconField iconPosition="left">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    </template>
    <template #empty> No customers found. </template>
    <template #loading> Loading customers data. Please wait. </template>
    <Column field="name" header="Name"></Column>
    <Column header="Categories">
      <template #body="slotProps">
        <Tag
          v-for="category in slotProps.data.categories"
          :key="category"
          :value="category"
          class="mb-1 mr-1 !bg-primary-500"
        />
      </template>
    </Column>
    <Column field="description" header="Description"></Column>
  </DataTable>
</template>
