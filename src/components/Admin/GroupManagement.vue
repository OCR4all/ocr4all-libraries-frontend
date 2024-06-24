<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DataTable from "primevue/datatable";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Column from "primevue/column";
import Button from "primevue/button";
import { FilterMatchMode } from "@primevue/core/api";

const uiStore = useUiStore()
uiStore.breadcrumb = [
  {
    label: "Administration",
  },
  {
    label: "Group Management"
  }
]

import {useI18n} from "vue-i18n";
import { useUiStore } from "@/stores/ui.store";
const i18n = useI18n()

const groups = ref();
const selectedGroups = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

async function refetch() {
  useCustomFetch(`/administration/security/group/list`)
    .json()
    .then((response) => {
      groups.value = response.data.value;
    });
}

function openNewGroupDialog(){

}

function openDeleteGroupDialog(){

}
refetch();
</script>
<template>
  <Toolbar class="mb-4">
    <template #start>
      <div class="my-2 space-x-2">
        <ActionButton
          rounded
          type="primary"
          size="large"
          @click="openNewGroupDialog"
        >
          Create Group
        </ActionButton>
        <ActionButton
          rounded
          type="delete"
          size="large"
          @click="openDeleteGroupDialog(selectedGroups)"
          :disabled="!selectedGroups || !selectedGroups.length"
        >
          Delete Group
        </ActionButton>
      </div>
    </template>
  </Toolbar>
  <DataTable
    ref="dt"
    scrollable
    :value="groups"
    v-model:selection="selectedGroups"
    dataKey="label"
    :paginator="true"
    :rows="10"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
  >
    <template #header>
      <div class="align-items-center flex flex-wrap justify-between gap-2">
           <span class="text-xl font-bold">
            Group management
          </span>
        <InputText
          v-model="filters['global'].value"
          :placeholder="
            $t('admin.user-management.table.search-placeholder')
          "
        />
      </div>
    </template>
    <Column
      selectionMode="multiple"
      style="width: 3rem"
      :exportable="false"
    ></Column>
    <Column
      field="label"
      header="Label"
      sortable
    ></Column>
    <Column
      field="name"
      header="Name"
      sortable
    ></Column>
    <Column
      field="state"
      header="State"
      sortable
    ></Column>
    <Column
      field="users"
      header="Users"
      sortable
    >
      <template #body="{ data }">
        <Tag
          v-for="user in data.users"
          :key="user.login"
          :value="user.login"></Tag>
      </template>
    </Column>
    <Column :exportable="false" style="min-width: 8rem">
      <template #body="slotProps">
        <Button
          icon="pi pi-pencil"
          outlined
          rounded
          class="mr-2"
          @click="openEditUserDialog(slotProps.data)"
        />
        <Button
          icon="pi pi-trash"
          outlined
          rounded
          severity="danger"
          @click="openDeleteDialog([slotProps.data])"
        />
      </template>
    </Column>
  </DataTable>
</template>
