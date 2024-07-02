<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DataTable from "primevue/datatable";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Column from "primevue/column";
import Button from "primevue/button";
import { FilterMatchMode } from "@primevue/core/api";

const createGroupDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Admin/GroupManagement/Dialog/CreateGroupDialog/CreateGroupDialogForm.vue"
    ),
);
const editGroupDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Admin/GroupManagement/Dialog/EditGroupDialog/EditGroupDialogForm.vue"
    ),
);
const deleteGroupDialog = defineAsyncComponent(
  () =>
    import("@/components/Admin/GroupManagement/Dialog/DeleteGroupDialog.vue"),
);

const dialog = useDialog();

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Administration",
    to: "/admin/dashboard",
  },
  {
    label: "Group Management",
  },
];

useHead({
  title: "Group Management",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui.store";
import { useDialog } from "primevue/usedialog";
const i18n = useI18n();

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

function openNewGroupDialog() {
  dialog.open(createGroupDialog, {
    props: {
      header: "Create Group",
      modal: true,
    },
    onClose: () => {
      refetch();
    },
  });
}

function openEditGroupDialog(data) {
  dialog.open(editGroupDialog, {
    props: {
      header: i18n.t("admin.group-management.dialog.edit.header"),
      modal: true,
    },
    data: {
      data,
    },
    onClose: () => {
      refetch();
    },
  });
}
function openDeleteGroupDialog(data: any) {
  dialog.open(deleteGroupDialog, {
    props: {
      header: i18n.t("admin.user-management.dialog.delete.single.header"),
      modal: true,
    },
    data: {
      data,
    },
    onClose: () => {
      refetch();
    },
  });
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
        <span class="text-xl font-bold"> Group management </span>
        <InputText
          v-model="filters['global'].value"
          :placeholder="$t('admin.user-management.table.search-placeholder')"
        />
      </div>
    </template>
    <Column
      selectionMode="multiple"
      style="width: 3rem"
      :exportable="false"
    ></Column>
    <Column field="label" header="Label" sortable></Column>
    <Column field="name" header="Name" sortable></Column>
    <Column field="state" header="State" sortable></Column>
    <Column field="users" header="Users" sortable>
      <template #body="{ data }">
        <div class="flex space-x-1">
          <Tag
            v-for="user in data.users"
            :key="user.login"
            :value="user.login"
          ></Tag>
        </div>
      </template>
    </Column>
    <Column :exportable="false" style="min-width: 8rem">
      <template #body="slotProps">
        <Button
          icon="pi pi-pencil"
          text
          rounded
          class="mr-2"
          @click="openEditGroupDialog(slotProps.data)"
        />
        <Button
          icon="pi pi-trash"
          text
          rounded
          severity="danger"
          @click="openDeleteGroupDialog([slotProps.data])"
        />
      </template>
    </Column>
  </DataTable>
</template>
