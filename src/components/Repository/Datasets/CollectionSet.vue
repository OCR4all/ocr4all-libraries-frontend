<script setup lang="ts">
import { LocationQueryValue, Router } from "vue-router";
import { useUiStore } from "@/stores/ui.store";
import { useCustomFetch } from "@/composables/useCustomFetch";
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import axios from "axios";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
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
const dialog = useDialog()

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

const sets = ref()

async function refresh(){
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
    .post(
      `${config.baseUrl}/data/collection/set/upload/${dataset}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          progress.value = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100),
          );
        },
      },
    )
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

async function downloadSet(data){
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

const items = ref()
const menu = ref()
const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openEditDialog(data)
          },
        },
        {
          label: "Download",
          icon: "pi pi-download",
          command: () => {
            downloadSet(data)
          }
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            openDeleteDialog(data)
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

const selectedSets = ref()

const rowClass = (data) => {
  return ["cursor-pointer"];
};

const filters: RemovableRef<any> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const layout: RemovableRef<string> = useLocalStorage("ocr4all/frontend/repository/datasets/layout", "grid")
const options = ref(["list", "grid"]);

refresh()
</script>
<template>
  <Toast position="bottom-right" group="download-toast">
    <template #message="slotProps">
      <div class="flex-column align-items-start flex" style="flex: 1">
        <div class="align-items-center flex gap-4">
          <ProgressSpinner
            :pt="{
              root: {
                class:
                  'relative self-center mx-auto w-6 h-6 inline-block before:block before:pt-full',
              },
            }"
            animation-duration=".5s"
            aria-label="Custom ProgressSpinner"
          />
          <div class="text-md my-3 text-surface-800">
            {{ slotProps.message.summary }}
          </div>
        </div>
      </div>
    </template>
  </Toast>
  <Menu ref="menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <a
        v-ripple
        class="flex items-center group"
        :class="{
          'rounded-md hover:bg-red-500 hover:text-white':
            item.label === 'Delete',
        }"
        v-bind="props.action"
      >
        <span
          :class="[item.icon, { 'text-red-500 group-hover:text-white':
            item.label === 'Delete'}]" />
        <span
          :class="{
          'text-red-500 group-hover:text-white':
            item.label === 'Delete',
        }">{{ item.label }}</span>
      </a>
    </template>
  </Menu>
  <div
    class="rounded-xl bg-surface-0 p-4 @container/content dark:bg-surface-900"
  >
      <Toolbar class="mb-4">
        <template #start>
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
        </template>
      </Toolbar>
  <ComponentContainer>
  <DataView :value="sets" :layout="layout">
    <template #header>
      <div class="flex justify-end">
        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
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
          lazy
          :paginator="true"
          :rows="5"
          :rows-per-page-options="[5, 10, 20, 50]"
          :row-class="rowClass"
          :row-hover="true"
          table-style="min-width: 50rem"
        >
          <template #header>
            <div class="grid grid-cols-1 sm:grid-cols-2 items-center justify-items-start sm:justify-items-between gap-2">
              <h4 class="m-0 font-bold">
                Manage Datasets
              </h4>
              <div class="flex justify-self-start sm:justify-self-end">
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Search" />
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
                <Tag v-for="keyword of slotProps.data.keywords" :key="keyword">{{
                    keyword
                  }}</Tag>
              </div>
            </template>
          </Column>
          <Column
            field="date"
            :header="$t('pages.projects.overview.table.columns.created')"
            :sortable="true"
          >
            <template #body="{ data }">
              <UseTimeAgo
                v-slot="{ timeAgo }"
                :time="Date.parse(data.date)"
              >
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

    <template #grid="slotProps">

    </template>
  </DataView>
  </ComponentContainer>
  </div>
  {{sets }}
</template>
