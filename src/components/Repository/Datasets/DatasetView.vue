<script setup lang="ts">
import { useDialog } from "primevue/usedialog";
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import { FilterMatchMode } from "@primevue/core/api";
import { ToastServiceMethods } from "primevue/toastservice";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import { IContainer } from "@/components/Project/project.interfaces";
import { ICollectionSet } from "@/components/Repository/Datasets/dataset.interfaces";

const router = useRouter();

const createDatasetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/CreateDataset.vue"),
);
const editDatasetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/EditDataset.vue"),
);
const deleteDatasetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/DeleteDataset.vue"),
);

const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const dialog = useDialog();

const isRefetching: Ref<boolean> = ref(false);
const datasets: Ref<ICollectionSet[]> = ref([]);
const selectedDatasets: Ref<ICollectionSet[]> = ref([]);

const toast: ToastServiceMethods = useToast();

async function downloadDataset(data: ICollectionSet) {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/data/collection/set/zip/${data.id}`)
    .blob()
    .then((response) => {
      if(response.data.value){
        const url = window.URL.createObjectURL(new Blob([response.data.value]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${data.name}.zip`);
        document.body.appendChild(link);
        link.click();
      }else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Couldn't create export.",
          life: 3000,
        })
      }
      toast.removeGroup("download-toast");
    });
}

async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(
    `/data/collection/list`,
  )
    .get()
    .json();
  if(error.value){
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value,
      life: 3000,
    });
  }else{
    datasets.value = data.value.filter(function (container: IContainer){
      return container.right !== null
    })
  }
  setTimeout(function () {
    isRefetching.value = isFetching.value;
  }, 500);
}

await refetch();

const items = ref();
const menu = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openEditDialog(data);
          },
        },
        {
          label: "Download",
          icon: "pi pi-download",
          command: () => {
            downloadDataset(data);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            openDeleteDialog([data]);
          },
        },
      ],
    },
  ];
  menu.value.toggle(event);
};
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        openEditDialog(event.data);
      },
    },
    {
      label: "Download",
      icon: "pi pi-download",
      command: () => {
        downloadDataset(event.data);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        openDeleteDialog(event.data);
      },
    },
  ];
  contextMenu.value.toggle(event.originalEvent);
};

function openDataset(id: string, name: string) {
  router.push({
    name: "Dataset",
    query: { id: id, name: name },
  });
}

function openDeleteDialog(data: ICollectionSet) {
  dialog.open(deleteDatasetDialog, {
    props: {
      header: "Delete Dataset",
      modal: true,
    },
    data: data,
    onClose: () => {
      refetch();
    },
  });
}

function openCreateDialog() {
  dialog.open(createDatasetDialog, {
    props: {
      header: "Create Dataset",
      modal: true,
    },
    onClose: () => {
      refetch();
    },
  });
}

function openEditDialog(data: ICollectionSet) {
  dialog.open(editDatasetDialog, {
    props: {
      header: "Edit Dataset",
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

const contextMenu = ref();
</script>
<template>
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
  <Toast />
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
      <div class="my-2 flex space-x-2">
        <ActionButton
          rounded
          type="primary"
          size="large"
          @click="openCreateDialog"
        >
          {{ $t("pages.repository.overview.toolbar.button.create") }}
        </ActionButton>
        <ActionButton
          rounded
          type="delete"
          size="large"
          :disabled="!selectedDatasets || !selectedDatasets.length"
          @click="openDeleteDialog(selectedDatasets)"
        >
          {{ $t("pages.repository.overview.toolbar.button.delete") }}
        </ActionButton>
      </div>
    </template>
    <template #end> </template>
  </Toolbar>
  <ComponentContainer>
    <DataTable
      ref="containerDataTable"
      v-model:selection="selectedDatasets"
      :value="datasets"
      :filters="filters"
      lazy
      context-menu
      :paginator="true"
      :rows="5"
      :rows-per-page-options="[5, 10, 20, 50]"
      :row-hover="true"
      @row-contextmenu="onRowContextMenu"
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
            @click="openDataset(data.id, data.name)"
          >
            {{ data.name }}
          </p>
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
