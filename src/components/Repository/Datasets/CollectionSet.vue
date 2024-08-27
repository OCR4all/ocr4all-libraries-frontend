<script setup lang="ts">
import { LocationQueryValue, Router } from "vue-router";
import { useUiStore } from "@/stores/ui.store";
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import { useI18n } from "vue-i18n";
import { ToastServiceMethods } from "primevue/toastservice";
import { useToast } from "primevue/usetoast";
import { RemovableRef } from "@vueuse/core";
import InputText from "primevue/inputtext";
import Skeleton from "primevue/skeleton";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
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

const deleteDatasetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/DeleteDataset.vue"),
);

const uploadSetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/UploadSetDialog.vue"),
);

const codecDialog = defineAsyncComponent(
  () => import("@/components/Codec/CodecDialog.vue"),
);

import IconAnalytics from "~icons/carbon/data-analytics";
import IconUpload from "~icons/carbon/upload";
import IconDownload from "~icons/carbon/download";
import { useDialog } from "primevue/usedialog";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import { ISet } from "@/components/Repository/Datasets/dataset.interfaces";
import { Ref } from "vue";
const dialog = useDialog();

const { t } = useI18n();

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

function openUploadDialog() {
  dialog.open(uploadSetDialog, {
    props: {
      header: "Upload additional datasets",
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
      collection: dataset,
    },
    onClose: () => {
      refresh();
    },
  });
}

const sets: Ref<ISet[]> = ref([]);

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

function openEditDialog(data: ISet) {
  dialog.open(editSetDialog, {
    props: {
      header: "Edit Set",
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
      collection: dataset,
      set: data,
    },
    onClose: () => {
      refresh();
    },
  });
}

function openDeleteDialog(data: ISet) {
  dialog.open(deleteSetDialog, {
    props: {
      header: "Delete Set",
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
      collection: dataset,
      set: data,
    },
    onClose: () => {
      refresh();
    },
  });
}

async function downloadSet(data: ISet) {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/data/collection/set/download/${dataset}?id=${data.id}`)
    .blob()
    .then((response) => {
      if (response.data.value) {
        const url = window.URL.createObjectURL(new Blob([response.data.value]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${data.name}.zip`);
        document.body.appendChild(link);
        link.click();
      }
      toast.removeGroup("download-toast");
    });
}

async function downloadDataset() {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/data/collection/set/zip/${dataset}`)
    .blob()
    .then((response) => {
      if (response.data.value) {
        const url = window.URL.createObjectURL(new Blob([response.data.value]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${datasetName}.zip`);
        document.body.appendChild(link);
        link.click();
      }
      toast.removeGroup("download-toast");
    });
}

const items = ref();
const menu = ref();
const toggle = (event, data: ISet) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Open",
          icon: "pi pi-eye",
          command: () => {
            openSet(data);
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

async function openSet(data: ISet) {
  useCustomFetch(`/data/collection/set/entity/${dataset}?id=${data.id}`)
    .get()
    .json()
    .then((response) => {
      console.log(response.data.value);
    });
}

async function removeDataset() {
  const data = [
    {
      id: dataset,
    },
  ];

  dialog.open(deleteDatasetDialog, {
    props: {
      header: "Delete Dataset",
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
      router.push("/repository/overview?category=Datasets");
    },
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
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        openSet(event.data);
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
  ];
  contextMenu.value.show(event.originalEvent);
};

async function getCodec() {
  const files = [];
  for (const set of selectedSets.value) {
    const xml = set.files.find((file) => {
      return file["content-type"] === "application/xml";
    });
    if (xml) files.push(xml.name);
  }
  const payload = {
    datasets: [
      {
        id: dataset,
        filenames: files,
      },
    ],
    level: "TextLine",
    index: 0,
    normalizer: "NFD",
  };
  await useCustomFetch("/data/collection/set/codec")
    .post(payload)
    .json()
    .then((response) => {
      if (response.error.value) {
        console.error("Couldn't retrieve codec");
      } else {
        dialog.open(codecDialog, {
          props: {
            header: "Codec",
            modal: true,
            style: {
              width: "90vw",
            },
          },
          data: {
            codec: response.data.value,
          },
        });
      }
    });
}

refresh();
</script>
<template>
  <Toast position="bottom-right" group="download-toast">
    <template #container="{ message, closeCallback }">
      <div
        class="backdrop-md flex w-full items-center rounded-lg bg-surface-200/50 p-4 shadow dark:bg-surface-700/50"
        role="alert"
      >
        <div
          class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center"
        >
          <ProgressSpinner
            class="h-4 w-4"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Download Spinner"
          />
          <span class="sr-only">Fire icon</span>
        </div>
        <div
          class="ms-3 text-sm font-normal text-surface-800 dark:text-surface-100"
        >
          {{ message.summary }}
        </div>
        <button
          @click="closeCallback"
          type="button"
          class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-surface-800 hover:bg-gray-100 hover:text-surface-950 focus:ring-2 focus:ring-surface-300 dark:text-surface-200 dark:hover:bg-gray-800 dark:hover:text-white"
          data-dismiss-target="#toast-default"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
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
  <ComponentContainer spaced>
    <Toolbar class="mb-4">
      <template #start>
        <Button
          v-tooltip.top="
            $t('pages.repository.container.overview.toolbar.button.file-upload')
          "
          icon="pi pi-trash"
          @click="openUploadDialog"
          text
        >
          <IconUpload class="text-black dark:text-white" />
        </Button>
        <Button v-tooltip.top="'Export'" @click="downloadDataset" text>
          <IconDownload class="text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Analyze Codec'"
          @click="getCodec"
          :disabled="!selectedSets || !selectedSets.length"
          text
        >
          <IconAnalytics class="text-black dark:text-white" />
        </Button>
        <Button
          icon="pi pi-trash"
          @click="removeDataset"
          :disabled="!selectedSets || !selectedSets.length"
          severity="danger"
          text
        />
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
