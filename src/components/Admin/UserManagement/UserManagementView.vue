<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const createUserDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Admin/UserManagement/Dialog/CreateUserDialog/CreateUserDialogForm.vue"
    ),
);
const editUserDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Admin/UserManagement/Dialog/EditUserDialog/EditUserDialogForm.vue"
    ),
);
const deleteUserDialog = defineAsyncComponent(
  () => import("@/components/Admin/UserManagement/Dialog/DeleteUserDialog.vue"),
);

import { FilterMatchMode } from "@primevue/core/api";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import { useDialog } from "primevue/usedialog";

import IconCreateUser from "~icons/prime/user-plus";
import IconDeleteUser from "~icons/prime/user-minus";

const dialog = useDialog();

import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Administration",
    to: "/admin/dashboard",
  },
  {
    label: "User Management",
  },
];

useHead({
  title: "User Management",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

import { useI18n } from "vue-i18n";
const i18n = useI18n();

const users = ref();
const selectedUsers = ref();

async function refetch() {
  useCustomFetch(`/administration/security/user/list`)
    .json()
    .then((response) => {
      users.value = response.data.value;
    });
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const items = ref([]);
const menu = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => openEditUserDialog(data),
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => openDeleteDialog(data),
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
      command: () => openEditUserDialog(event.data),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => openDeleteDialog(event.data),
    },
  ];
  contextMenu.value.show(event.originalEvent);
};

function openEditUserDialog(data) {
  dialog.open(editUserDialog, {
    props: {
      header: i18n.t("admin.user-management.dialog.edit.header"),
      modal: true,
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    data: data,
    onClose: () => {
      refetch();
    },
  });
}

function openNewUserDialog() {
  dialog.open(createUserDialog, {
    props: {
      header: i18n.t("admin.user-management.dialog.create.header"),
      modal: true,
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    onClose: () => {
      refetch();
    },
  });
}

function openDeleteDialog(data: any) {
  dialog.open(deleteUserDialog, {
    props: {
      header: i18n.t("admin.user-management.dialog.delete.single.header"),
      modal: true,
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    data: [data],
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
  <ComponentContainer spaced>
    <Toolbar>
      <template #start>
        <Button
          severity="primary"
          v-tooltip.top="$t('admin.user-management.table.toolbar.add-user')"
          @click="openNewUserDialog"
          text
        >
          <IconCreateUser class="text-black dark:text-white" />
        </Button>
        <Button
          severity="danger"
          v-tooltip.top="$t('admin.user-management.table.toolbar.delete-user')"
          @click="openDeleteDialog(selectedUsers)"
          :disabled="!selectedUsers || !selectedUsers.length"
          text
        >
          <IconDeleteUser />
        </Button>
      </template>
      <template #end>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Search" />
        </IconField>
      </template>
    </Toolbar>
    <DataTable
      ref="dt"
      scrollable
      :value="users"
      v-model:selection="selectedUsers"
      dataKey="login"
      :paginator="true"
      @row-contextmenu="onRowContextMenu"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
    >
      <Column
        selectionMode="multiple"
        style="width: 3rem"
        :exportable="false"
      ></Column>
      <Column
        field="name"
        :header="$t('admin.user-management.table.columns.name')"
        sortable
        style="min-width: 16rem"
      ></Column>
      <Column
        field="login"
        :header="$t('admin.user-management.table.columns.login')"
        sortable
        style="min-width: 12rem"
      ></Column>
      <Column
        field="email"
        :header="$t('admin.user-management.table.columns.mail')"
        sortable
        style="min-width: 12rem"
      ></Column>
      <Column
        field="groups"
        :header="$t('admin.user-management.table.columns.groups')"
        sortable
        style="min-width: 12rem"
      >
        <template #body="slotProps">
          <div class="flex space-x-1">
            <Tag
              v-for="group in slotProps.data.groups"
              :key="group.label"
              :value="group.name"
              severity="info"
            />
          </div>
        </template>
      </Column>
      <Column
        field="state"
        :header="$t('admin.user-management.table.columns.state')"
        sortable
        style="min-width: 12rem"
      ></Column>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="space-y-2">
            <Button
              type="button"
              text
              severity="secondary"
              @click="toggle($event, data)"
            >
              <i class="pi pi-ellipsis-h text-black dark:text-white" />
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
