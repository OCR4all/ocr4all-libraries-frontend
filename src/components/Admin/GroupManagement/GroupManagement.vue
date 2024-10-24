<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Column from "primevue/column";
import Button from "primevue/button";
import { FilterMatchMode } from "@primevue/core/api";
import IconAddGroup from "~icons/fluent-mdl2/add-group";
import IconDeleteGroup from "~icons/ant-design/usergroup-delete-outlined";

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

import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui.store";
import { useDialog } from "primevue/usedialog";

import { IGroup } from "@/types/auth/group.types";

const dialog = useDialog();

const items: Ref = ref([]);
const menu = ref();

const toggle = (event: Event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => openEditGroupDialog(data),
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => openDeleteGroupDialog([data]),
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
      command: () => openEditGroupDialog(event.data),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => openDeleteGroupDialog([event.data]),
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
const i18n = useI18n();

const groups: Ref<IGroup[]> = ref([]);
const selectedGroups: Ref<IGroup[]> = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const isLoading = ref(true);

async function refetch() {
  useCustomFetch(`/administration/security/group/list`)
    .json()
    .then((response) => {
      groups.value = response.data.value;
      isLoading.value = false;
    });
}

function openNewGroupDialog() {
  dialog.open(createGroupDialog, {
    props: {
      header: "Create Group",
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

function openEditGroupDialog(data: IGroup) {
  dialog.open(editGroupDialog, {
    props: {
      header: "Edit Group",
      modal: true,
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
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
function openDeleteGroupDialog(data: IGroup[]) {
  console.log(data);
  dialog.open(deleteGroupDialog, {
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
    data: data,
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
    <Toolbar class="mb-4">
      <template #start>
        <Button
          v-tooltip.top="'Create Group'"
          severity="primary"
          text
          @click="openNewGroupDialog"
        >
          <IconAddGroup class="text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Remove Groups'"
          severity="danger"
          text
          :disabled="!selectedGroups || !selectedGroups.length"
          @click="openDeleteGroupDialog(selectedGroups)"
        >
          <IconDeleteGroup />
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
      :loading="isLoading"
      scrollable
      resizableColumns
      columnResizeMode="expand"
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
