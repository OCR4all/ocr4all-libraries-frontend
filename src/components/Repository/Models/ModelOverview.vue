<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DataTable, {DataTableRowContextMenuEvent} from "primevue/datatable";
import {IContainer} from "@/components/Project/project.interfaces";
import ShareDialog from "@/components/Repository/Images/Container/Dialog/ShareDialog.vue";
import Column from "primevue/column";
import Button from "primevue/button";

import IconCreate from "~icons/gridicons/create"

const EditModelDialog = defineAsyncComponent(
    () =>
        import(
            "@/components/Repository/Models/Dialog/EditModelDialog.vue"
            ),
);

const ShareModelDialog = defineAsyncComponent(
    () =>
        import(
            "@/components/Repository/Models/Dialog/ShareModelDialog.vue"
            ),
);

const dialog = useDialog()

const models = ref()

import { useConfirm } from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";
import {useDialog} from "primevue/usedialog";
import InputText from "primevue/inputtext";
import {FilterMatchMode} from "@primevue/core/api";
const confirm = useConfirm();
const toast = useToast();

async function fetch(){
  useCustomFetch("/assemble/model/list").get().json().then((response) => {
    models.value = response.data.value
    console.log(models.value)
  })
}

fetch()

const items = ref();
const menu = ref();

const toggle = (event: Event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Open",
          icon: "pi pi-eye",
          command: () => {
            openContainer(data.id, data.name);
          },
        },
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openEditDialog(data);
          },
        },
        {
          label: "Share",
          icon: "pi pi-share-alt",
          command: () => {
            openShareModal(data);
          },
        },
        {
          label: "Download",
          icon: "pi pi-download",
          command: () => {
            downloadModel(data);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            confirmDelete(data.id)
          },
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

function downloadModel(model: IModel) {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/assemble/model/zip/${model.id}`)
      .blob()
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data.value]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${model.name}.zip`);
        document.body.appendChild(link);
        link.click();
        toast.removeGroup("download-toast");
      });
}

const contextMenu = ref();
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        openContainer(event.data.id, event.data.name);
      },
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        openEditDialog(event.data);
      },
    },
    {
      label: "Share",
      icon: "pi pi-share-alt",
      command: () => {
        openShareDialog(event.data);
      },
    },
    {
      label: "Download",
      icon: "pi pi-download",
      command: () => {
        downloadModel(event.data);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDelete(event.data.id)
      },
    },
  ];
  contextMenu.value.show(event.originalEvent);
};

function openEditDialog(data: IModel){
  dialog.open(EditModelDialog, {
    props: {
      header: `Share "${data.name}"`,
      modal: true,
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
    },
    data: data,
    onClose: () => {
      fetch()
    },
  });
}

function openShareDialog(data: IModel){
  dialog.open(ShareModelDialog, {
    props: {
      header: `Share "${data.name}"`,
      modal: true,
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
    },
    data: data,
    onClose: () => {
      fetch()
    },
  });
}

const confirmDelete = (id: string) => {
  confirm.require({
    message: 'Do you want to delete this model?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    position: "bottom",
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      deleteModel(id)
    },
    reject: () => {

    }
  });
}

async function deleteModel(id: string) {
  useCustomFetch(`/assemble/model/remove?id=${id}`).then((response) => {
    if (!response.error.value) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Model removed",
        life: 3000,
        group: "general",
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Couldn't remove model",
        life: 3000,
        group: "general",
      });
    }
    fetch()
  });
}

// async function deleteModels() {
//   if(selectedModels.value !== undefined){
//     for (const container of selectedModels.value) {
//       await deleteModel(container.id);
//     }
//     toast.add({
//       severity: "success",
//       summary: "Success",
//       detail: "Containers deleted",
//       life: 3000,
//     });
//     toggleDeleteDialog();
//   }
// }

function openShareModal(data: IContainer) {
  dialog.open(ShareDialog, {
    props: {
      header: `Share ${name.value}`,
      modal: true,
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
    },
    data: data,
    onClose: () => {
      listContainers();
    },
  });
}

function getSeverity(state: string): string {
  switch(state){
    case "interrupted":
      return "danger"
    case "canceled":
      return "secondary"
    case "completed":
        return "success"
  }
}

const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedModels = ref([])
</script>
<template>
  <ConfirmDialog />
  <Toast position="bottom-right" group="download-toast">
    <template #container="{ message, closeCallback }">
      <div class="flex items-center w-full p-4 rounded-lg shadow bg-surface-200/50 dark:bg-surface-700/50 backdrop-md" role="alert">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
          <ProgressSpinner class="w-4 h-4" strokeWidth="8" fill="transparent"
                           animationDuration=".5s" aria-label="Download Spinner" />
          <span class="sr-only">Fire icon</span>
        </div>
        <div class="ms-3 text-sm text-surface-800 dark:text-surface-100 font-normal">{{ message.summary }}</div>
        <button @click="closeCallback" type="button" class="ms-auto -mx-1.5 -my-1.5 text-surface-800 hover:text-surface-950 rounded-lg focus:ring-2 focus:ring-surface-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-surface-200 dark:hover:text-white dark:hover:bg-gray-800" data-dismiss-target="#toast-default" aria-label="Close">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    </template>
  </Toast>
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
  <div class="grid gap-y-8">
    <ComponentContainer>
      <Toolbar>
        <template #start>
          <Button text>
            <IconCreate class="text-black dark:text-white" />
          </Button>
          <Button icon="pi pi-trash" @click="confirmDelete" :disabled="selectedModels.length == 0" severity="danger" text />
        </template>
        <template #end>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
                v-model="filters['global'].value"
                placeholder="Search"
            />
          </IconField>
        </template>
      </Toolbar>
      <DataTable :value="models" contextMenu
                 @rowContextmenu="onRowContextMenu" v-model:selection="selectedModels" :filters="filters">
        <Column
            selection-mode="multiple"
            style="width: 3rem"
            :exportable="false"
        ></Column>
        <Column field="name" header="Name"></Column>
        <Column field="engine.type" header="Engine">
          <template #body="{ data }">
            <Tag v-if="data.engine" :value="data.engine.type" />
          </template>
        </Column>
        <Column field="description" header="Description"></Column>
        <Column field="engine.state" header="State">
          <template #body="{ data }">
            <Tag v-if="data.engine" :value="data.engine.state" :severity="getSeverity(data.engine.state)" />
          </template>
        </Column>
        <Column field="keywords" header="Keywords">
          <template #body="{ data }">
            <div class="flex flex-col space-y-1">
              <Tag v-for="keyword of data.keywords" :key="keyword" :value="keyword" />
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
  </div>
</template>