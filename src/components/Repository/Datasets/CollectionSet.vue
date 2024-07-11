<script setup lang="ts">
import { LocationQueryValue, Router } from "vue-router";
import { useUiStore } from "@/stores/ui.store";
import { useCustomFetch } from "@/composables/useCustomFetch";
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import axios from "axios";
import Button from "primevue/button";
import { useI18n } from "vue-i18n";
import { Store } from "pinia";
import { useConfigStore } from "@/stores/config.store";
import { useAuthStore } from "@/stores/auth.store";
import { ToastServiceMethods } from "primevue/toastservice";
import { useToast } from "primevue/usetoast";
import { RemovableRef } from "@vueuse/core";
import InputText from "primevue/inputtext";
import Skeleton from "primevue/skeleton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "@primevue/core/api";
import { UseTimeAgo } from "@vueuse/components";

const toast: ToastServiceMethods = useToast();

const editSetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/EditSet.vue"),
);

const deleteSetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/DeleteSet.vue"),
);

import { useDialog } from "primevue/usedialog";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
const dialog = useDialog();

const { t } = useI18n();

const config: Store = useConfigStore();
const auth: Store = useAuthStore();

const router: Router = useRouter();
const dataset: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.id;
const datasetName: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.name;

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Repository",
    to: "/repository/overview",
  },
  {
    label: "Dataset",
    to: "/repository/overview",
  },
  {
    label: datasetName,
  },
];

const showUploadToast = () => {
  if (!uploadToastVisible.value) {
    toast.add({
      severity: "custom",
      summary: t(
        "pages.repository.container.overview.toast.upload.headless.summary",
      ),
      group: "headless",
    });
    uploadToastVisible.value = true;
    progress.value = 0;
  }
};

const sets = ref();

async function refresh() {
  useCustomFetch(`/data/collection/set/list/${dataset}`)
    .get()
    .json()
    .then((response) => {
      sets.value = response.data.value;
    });
}

useHead({
  title: datasetName,
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

const uploadToastVisible = ref(false);
const progress = ref(0);

const fileUpload = ref();
const uploader = async function customUploader(event: FileUploadUploaderEvent) {
  const formData = new FormData();

  const filesToHandle = Array.isArray(event.files)
    ? event.files
    : [event.files];
  for (const file of filesToHandle) {
    // Add Mime Type validation
    formData.append("files", file);
  }
  showUploadToast();
  axios.defaults.timeout = 100000;
  axios
    .post(`${config.baseUrl}/data/collection/set/upload/${dataset}`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        progress.value = parseInt(
          Math.round((progressEvent.loaded / progressEvent.total) * 100),
        );
      },
    })
    .then(function () {
      fileUpload.value.clear();
      fileUpload.value.uploadedFileCount = 0;
      refresh();
      hideUploadToast();
    })
    .catch(function (error) {
      console.log(error);
    });
};

function openEditDialog(data) {
  dialog.open(editSetDialog, {
    props: {
      header: "Edit Set",
      modal: true,
    },
    data: {
      collection: dataset,
      set: data,
    },
    onClose: () => {
      refresh();
    },
  });
}

function openDeleteDialog(data) {
  dialog.open(deleteSetDialog, {
    props: {
      header: "Delete Set",
      modal: true,
    },
    data: {
      collection: dataset,
      set: data,
    },
    onClose: () => {
      refresh();
    },
  });
}

async function downloadSet(data) {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/data/collection/set/download/${dataset}?id=${data.id}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data.name}.zip`);
      document.body.appendChild(link);
      link.click();
      toast.removeGroup("download-toast");
    });
}

async function downloadDataset(data) {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/data/collection/set/zip/${dataset}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${datasetName}.zip`);
      document.body.appendChild(link);
      link.click();
      toast.removeGroup("download-toast");
    });
}

const items = ref();
const menu = ref();
const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Open",
          icon: "pi pi-eye",
          command: () => {
            openSet(data)
          }
        },
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
            downloadSet(data);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            openDeleteDialog(data);
          },
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

const hideUploadToast = () => {
  //code before the pause
  setTimeout(function () {
    toast.removeGroup("headless");
    uploadToastVisible.value = false;
    progress.value = 0;
    toast.add({
      severity: "success",
      summary: t(
        "pages.repository.container.overview.toast.upload.success.detail",
      ),
      detail: t(
        "pages.repository.container.overview.toast.upload.success.summary",
      ),
      life: 3000,
    });
  }, 2000);
};

async function openSet(data) {
  console.log(data)
  useCustomFetch(`/data/collection/set/entity/${dataset}?id=${data.id}`)
    .get()
    .json()
    .then((response) => {
      console.log(response.data.value)
    });
}

const selectedSets = ref();

const filters: RemovableRef<any> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const layout: RemovableRef<string> = useLocalStorage(
  "ocr4all/frontend/repository/datasets/layout",
  "grid",
);
const options = ref(["list", "grid"]);

const contextMenu = ref();
const onRowContextMenu = (event) => {
  (items.value = [
    {
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        openSet(event.data)
      }
    },
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
        downloadSet(event.data);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        openDeleteDialog(event.data);
      },
    },
  ])
  contextMenu.value.show(event.originalEvent);
};

refresh();
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
      <div class="flex gap-x-2">
        <FileUpload
          ref="fileUpload"
          name="folioUpload[]"
          :choose-label="
          t('pages.repository.container.overview.toolbar.button.file-upload')
        "
          mode="basic"
          :auto="true"
          :custom-upload="true"
          :multiple="true"
          :pt="{
          chooseButton: {
            class:
              'rounded-md flex bg-primary-600 p-4 text-white cursor-pointer',
          },
        }"
          :max-file-size="1000000000"
          @uploader="uploader"
        >
        </FileUpload>
        <Button
          @click="downloadDataset"
          label="Export"
          icon="pi pi-download" />
      </div>
    </template>
  </Toolbar>
  <ComponentContainer>
    <DataView :value="sets" :layout="layout">
      <template #header>
        <div class="flex justify-end">
          <SelectButton
            v-model="layout"
            :options="options"
            :allow-empty="false"
          >
            <template #option="{ option }">
              <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            </template>
          </SelectButton>
        </div>
      </template>

      <template #list="slotProps">
        <DataTable
          ref="containerDataTable"
          v-model:selection="selectedSets"
          :value="slotProps.items"
          :filters="filters"
          context-menu
          :paginator="true"
          :rows="5"
          :rows-per-page-options="[5, 10, 20, 50]"
          :row-hover="true"
          table-style="min-width: 50rem"
          @row-contextmenu="onRowContextMenu"
        >
          <template #header>
            <div
              class="sm:justify-items-between grid grid-cols-1 items-center justify-items-start gap-2 sm:grid-cols-2"
            >
              <h4 class="m-0 font-bold">Manage Datasets</h4>
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
          </Column>
          <Column
            field="keywords"
            :header="
              $t('pages.repository.overview.dataview.list.column.keywords')
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
            <template #body="slotProps">
              <div class="flex space-x-1">
                <Tag
                  v-for="keyword of slotProps.data.keywords"
                  :key="keyword"
                  >{{ keyword }}</Tag
                >
              </div>
            </template>
          </Column>
          <Column
            field="description"
            :header="$t('pages.projects.overview.table.columns.description')"
            :sortable="true"
          >
          </Column>
          <Column
            field="date"
            :header="$t('pages.projects.overview.table.columns.created')"
            :sortable="true"
          >
            <template #body="{ data }">
              <UseTimeAgo v-slot="{ timeAgo }" :time="Date.parse(data.date)">
                {{ timeAgo }}
              </UseTimeAgo>
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
      </template>

      <template #grid="slotProps"> </template>
    </DataView>
  </ComponentContainer>
</template>
