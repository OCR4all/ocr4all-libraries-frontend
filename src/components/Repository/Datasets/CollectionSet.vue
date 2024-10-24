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
import IconLarex from "~icons/fluent/notebook-eye-20-filled";
import IconTrash from "~icons/heroicons/trash"
import IconRefresh from "~icons/heroicons/arrow-path";

const formFileMap = ref()
const formMimeMap = ref()
const larexForm = ref()

const isLoading = ref(true)

const entities = ref({})
const groundTruth = ref([])

const toast: ToastServiceMethods = useToast();
const confirm = useConfirm()

const expandedRows = ref([])

const editSetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/EditSet.vue"),
);

const deleteSetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/DeleteSet.vue"),
);

const uploadSetDialog = defineAsyncComponent(
  () => import("@/components/Repository/Datasets/Dialog/UploadSetDialog.vue"),
);

const evaluationDialog = defineAsyncComponent(
    () => import("@/components/Repository/Datasets/Dialog/EvaluationDialog.vue"),
);

const codecDialog = defineAsyncComponent(
  () => import("@/components/Codec/CodecDialog.vue"),
);

import IconAnalytics from "~icons/carbon/data-analytics";
import IconUpload from "~icons/fluent/arrow-upload-24-filled";
import IconDownload from "~icons/fluent/arrow-download-24-filled";
import IconEvaluation from "~icons/carbon/compare";
import { useDialog } from "primevue/usedialog";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import {ICollectionSet, ISet} from "@/components/Repository/Datasets/dataset.interfaces";
import { Ref } from "vue";
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import ProgressBar from "primevue/progressbar";
import IconActions from "~icons/fluent/more-vertical-32-regular"
import {useConfirm} from "primevue/useconfirm";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore()
console.log(configStore.larexUrl)


const dialog = useDialog();

const { t } = useI18n();
const auth = useAuthStore()

const router: Router = useRouter();
const dataset: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.id;
const datasetName: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.name;

const uploadToastVisible = ref(false);
const progress = ref(0);


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
      toast.add({
        severity: "success",
        summary: t(
          "pages.repository.container.overview.toast.upload.success.detail",
        ),
        detail: t(
          "pages.repository.container.overview.toast.upload.success.summary",
        ),
        life: 3000,
        group: "general",
      });
      refresh();
    },
  });
}

const sets: Ref<ISet[]> = ref([]);

const loading = reactive({
  textline: true,
  textregion: true
})

const isRefetching = ref(true)

async function refresh() {
  isRefetching.value = true
  useCustomFetch(`/data/collection/set/list/${dataset}`)
    .get()
    .json()
    .then((response) => {
      sets.value = response.data.value;
      isLoading.value = false
      isRefetching.value = false
    });
  useCustomFetch(`/data/collection/set/pageXML/${dataset}`)
      .post({
        level: "TextRegion",
        index: 0
      })
      .json()
      .then((response) => {
        for(const result of response.data.value){
          if(!groundTruth.value.includes(result.id)){
            groundTruth.value.push(result.id)
          }
        }
        loading.textregion = false
      })
  useCustomFetch(`/data/collection/set/pageXML/${dataset}`)
      .post({
        level: "TextLine",
        index: 0
      })
      .json()
      .then((response) => {
        console.log(response.data.value)
        for(const result of response.data.value){
          if(!groundTruth.value.includes(result.id)){
            groundTruth.value.push(result.id)
          }
        }
        loading.textline = false
      })
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
      data: [data],
    },
    onClose: () => {
      refresh();
    },
  });
}

async function evaluate(){
  dialog.open(evaluationDialog, {
    props: {
      header: "Evaluation",
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
      sets: selectedSets.value.map(item => item.id),
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

function removeFile(id, extension){
  confirm.require({
    message: "Do you want to delete this file?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    position: "bottom",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: async () => {
      await deleteFile(id, extension);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "File successfully deleted.",
        life: 3000,
        group: "general",
      });
      fetchField(id)
    },
    reject: () => {},
  });
}

async function deleteFile(id: string, extension: string){
  useCustomFetch(`/api/v1.0/data/collection/set/remove/file/${dataset}?id=${id}?suffix=${extension}`)
      .get()
      .json()
}

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
      group: "general",
    });
  }, 2000);
};


async function openInLarex(){
  const fileMap = {}
  const mimeMap = {}

  const environment = await useCustomFetch(`/instance/environment`).get().json()
  const basePath = environment.data.value.folders.find((element) => element.type === 'data').folder.replace("/srv/ocr4all/", "/home/books/")

  const { data } = await useCustomFetch(`/data/collection/set/list/${dataset}`).get().json()
  for(const set of data.value){
    for(const file of set.files){
      if(file["content-type"] !== 'application/xml'){
        const basename = file.name.replace(`.${file.extension}`, '')
        const path = `${basePath}/${dataset}/${file.name}`
        mimeMap[`${path}`] = file["content-type"]
        if(basename in fileMap){
          fileMap[basename].push(path)
        }else{
          fileMap[basename] = [path]
        }
      }
    }
  }

  formFileMap.value = JSON.stringify(fileMap)
  formMimeMap.value = JSON.stringify(mimeMap)

  await nextTick()
  larexForm.value.submit()
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

const showUploadToast = () => {
  if (!uploadToastVisible.value) {
    toast.add({
      summary: t(
        "pages.repository.container.overview.toast.upload.headless.summary",
      ),
      group: "headless",
    });
    uploadToastVisible.value = true;
    progress.value = 0;
  }
};

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
    .post(`/data/collection/set/upload/${dataset}`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        progress.value = parseInt(
          String(Math.round((progressEvent.loaded / progressEvent.total) * 100)),
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

const items = ref();
const menu = ref();
const toggle = (event, data: ISet) => {
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

async function removeSelectedSets() {
  dialog.open(deleteSetDialog, {
    props: {
      header: "Delete Sets",
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
      data: selectedSets,
    },
    onClose: () => {
      refresh()
    },
  });
}

const selectedSets: Ref<ICollectionSet[]> = ref([]);

const filters: RemovableRef<any> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const contextMenu = ref();
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

function onRowExpand(event){
  fetchField(event.data.id)
}

function fetchField(id: string){
  isLoading.value = true
  useCustomFetch(`/data/collection/set/entity/${dataset}?id=${id}`)
      .get()
      .json()
      .then((response) => {
        entities.value[id] = response.data.value.files
        isLoading.value = false
      });
}

refresh();
</script>
<template>
  <Toast
    position="top-center"
    group="headless"
    @close="uploadToastVisible = false"
  >
    <template #container="{ message, closeCallback }">
      <section
        class="flex w-full flex-col gap-4 rounded-xl border border-surface-300 bg-surface-950/40 p-4 backdrop-blur-sm dark:border-surface-800 dark:bg-surface-800/40"
      >
        <div class="flex w-full gap-3 justify-self-center">
          <i
            class="pi pi-cloud-upload text-2xl text-surface-0 dark:text-primary-0"
          ></i>
          <p
            class="m-0 text-base font-semibold text-surface-0 dark:text-primary-0"
          >
            Uploading your dataset
          </p>
        </div>
        <div v-if="progress < 100" class="w-full">
          <ProgressBar :value="progress"></ProgressBar>
        </div>
        <div
          v-else-if="progress === 100"
          class="flex flex-col justify-center space-y-2"
        >
          <ProgressBar mode="indeterminate"></ProgressBar>
          <p class="self-center font-semibold text-surface-50">
            Finalizing upload
          </p>
        </div>
        <div class="mb-4 flex justify-end gap-4">
          <Button label="Cancel" size="small" @click="closeCallback">
            <p class="font-semibold text-white">Cancel</p>
          </Button>
        </div>
      </section>
    </template>
  </Toast>
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
            stroke-width="8"
            fill="transparent"
            animation-duration=".5s"
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
          type="button"
          class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-surface-800 hover:bg-gray-100 hover:text-surface-950 focus:ring-2 focus:ring-surface-300 dark:text-surface-200 dark:hover:bg-gray-800 dark:hover:text-white"
          data-dismiss-target="#toast-default"
          aria-label="Close"
          @click="closeCallback"
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
  <form
    id="larexForm"
    ref="larexForm"
    class="justify-self-center"
    :action="configStore.larexUrl"
    method="POST"
    target="_blank"
  >
    <input
      id="fileMap"
      v-model="formFileMap"
      type="hidden"
      name="fileMap"
    />
    <input
      id="mimeMap"
      v-model="formMimeMap"
      type="hidden"
      name="mimeMap"
    />
    <input id="metsFilePath" value="" type="hidden" name="metsFilePath" />
    <input id="customFlag" value="" type="hidden" name="customFlag" />
    <input id="customFolder" value="" type="hidden" name="customFolder" />
    <input id="modes" value="" type="hidden" name="modes" />
  </form>
  <ComponentContainer spaced>
    <ConfirmDialog />
    <Toolbar class="mb-4">
      <template #start>
        <FileUpload
          ref="fileUpload"
          name="folioUpload"
          mode="advanced"
          :custom-upload="true"
          :multiple="true"
          :auto="true"
          :accept="null"
          :max-file-size="100000000"
          @uploader="uploader"
        >
          <template #header="{ chooseCallback }">
            <Button text @click="chooseCallback()">
              <IconUpload class="text-black dark:text-white" />
            </Button>
          </template>
        </FileUpload>
        <Button v-tooltip.top="'Download'" text @click="downloadDataset">
          <IconDownload class="text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Analyze Codec'"
          :disabled="!selectedSets || !selectedSets.length"
          text
          @click="getCodec"
        >
          <IconAnalytics class="text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Evaluate'"
          :disabled="!selectedSets || !selectedSets.length"
          text
          @click="evaluate"
        >
          <IconEvaluation class="text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Open in LAREX'"
          text
          @click="openInLarex"
        >
          <IconLarex class="text-black dark:text-white" />
        </Button>
        <Button
          icon="pi pi-trash"
          :disabled="!selectedSets || !selectedSets.length"
          severity="danger"
          text
          @click="removeSelectedSets"
        />
      </template>
      <template #end>
        <button
          v-tooltip.left="'Refresh'"
          :disabled="isRefetching === true"
          @click="refresh"
        >
          <IconRefresh
            :class="{ 'animate-spin': isRefetching }"
            class="mr-2 h-6 w-6 text-surface-500 hover:text-black dark:text-surface-200 dark:hover:text-white"
          />
        </button>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Search" />
        </IconField>
      </template>
    </Toolbar>
    <DataTable
        ref="containerDataTable"
        v-model:selection="selectedSets"
        v-model:expandedRows="expandedRows"
        :loading="isLoading"
        :value="sets"
        resizableColumns
        columnResizeMode="expand"
        :filters="filters"
        context-menu
        :paginator="true"
        :rows="20"
        :rows-per-page-options="[5, 10, 20, 50]"
        :row-hover="true"
        table-style="min-width: 50rem"
        @row-contextmenu="onRowContextMenu"
        @rowExpand="onRowExpand"
      >
        <Column expander style="width: 5rem" />
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
        <Column header="Ground Truth">
          <template #body="{ data }">
            <Skeleton v-if="loading.textregion && loading.textline" height="2rem"></Skeleton>
            <i class="pi" :class="{ 'pi-check-circle text-green-500 ': groundTruth.includes(data.id), 'pi-times-circle text-red-500': !groundTruth.includes(data.id) }"></i>
          </template>
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
                text
                severity="secondary"
                @click="toggle($event, data)"
              >
                <IconActions class="text-surface-900 dark:text-surface-100" />
              </Button>
            </div>
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="p-4">
            <h5 class="text-lg font-semibold">Files</h5>
              <DataTable :value="entities[slotProps.data.id]" resizableColumns columnResizeMode="expand">
                <Column field="name" header="Name" sortable></Column>
                <Column field="extension" header="Extension" sortable></Column>
                <Column field="content-type" header="Content Type" sortable></Column>
                <Column>
                  <template #body="{ data }">
                    <Button @click="removeFile(slotProps.data.id, data.extension)" severity="danger" text>
                      <IconTrash class="text-red-800 dark:text-red-200" />
                    </Button>
                  </template>
                </Column>
              </DataTable>
          </div>
        </template>
      </DataTable>
  </ComponentContainer>
</template>
<style>
.p-fileupload {
  @apply !border-none
}
.p-fileupload-content {
  @apply !hidden
}
.p-fileupload-header {
  @apply !border-none !p-0
}
</style>
