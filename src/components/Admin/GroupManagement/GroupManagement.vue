<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
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

const items = ref([])
const menu = ref()

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => openEditGroupDialog(data)
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => openDeleteGroupDialog(data)
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

const contextMenu = ref();
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => openEditGroupDialog(event.data)
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => openDeleteGroupDialog(event.data)
    },
  ];
  contextMenu.value.show(event.originalEvent);
};

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
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
    },
    onClose: () => {
      refetch();
    },
  });
}

function openEditGroupDialog(data) {
  dialog.open(editGroupDialog, {
    props: {
      header: "Edit Group",
      modal: true,
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
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
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
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
  <ContextMenu ref="contextMenu" :model="items">
    <template #item="{ item, props }">
      <a
        v-ripple
        class="group flex items-center"
        :class="{
          'rounded-md hover:bg-red-500 hover:text-white':
            item.label === 'Delete',
        }"
        v-bind="props.action"
      >
        <span
          :class="[
            item.icon,
            { 'text-red-500 group-hover:text-white': item.label === 'Delete' },
          ]"
        />
        <span
          :class="{
            'text-red-500 group-hover:text-white': item.label === 'Delete',
          }"
        >{{ item.label }}</span
        >
      </a>
    </template>
  </ContextMenu>
  <Menu ref="menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <a
        v-ripple
        class="group flex items-center"
        :class="{
          'rounded-md hover:bg-red-500 hover:text-white':
            item.label === 'Delete',
        }"
        v-bind="props.action"
      >
        <span
          :class="[
            item.icon,
            { 'text-red-500 group-hover:text-white': item.label === 'Delete' },
          ]"
        />
        <span
          :class="{
            'text-red-500 group-hover:text-white': item.label === 'Delete',
          }"
        >{{ item.label }}</span
        >
      </a>
    </template>
  </Menu>
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
          :disabled="!selectedGroups || !selectedGroups.length"
          @click="openDeleteGroupDialog(selectedGroups)"
        >
          Delete Group
        </ActionButton>
      </div>
    </template>
  </Toolbar>
  <ComponentContainer>
    <DataTable
      ref="dt"
      scrollable
      :value="groups"
      v-model:selection="selectedGroups"
      dataKey="label"
      :paginator="true"
      :rows="10"
      :filters="filters"
      @row-contextmenu="onRowContextMenu"
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
        <template #body="{ data }">
          <div class="space-y-2">
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              text
              severity="secondary"
              @click="toggle($event, data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
