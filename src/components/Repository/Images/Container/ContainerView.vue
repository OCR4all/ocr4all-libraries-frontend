<script setup lang="ts">
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";

const toast: ToastServiceMethods = useToast();
import Toast from "primevue/toast";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import Dialog from "primevue/dialog";
import { LocationQueryValue, Router } from "vue-router";
import { ToastServiceMethods } from "primevue/toastservice";
import { Store } from "pinia";
import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui.store";
import { UseTimeAgo } from "@vueuse/components";
import { useLocalDateFormat } from "@/composables/useLocalDateFormat";
const auth: Store = useAuthStore();
import IconImageUpload from "~icons/icon-park-outline/upload-picture";
import Skeleton from "primevue/skeleton";

const { t } = useI18n();

const folios = ref();
const isLoading = ref(true);

const layout: Ref<"list" | "grid" | undefined> = ref("grid");
const options = ref(["list", "grid"]);

const router: Router = useRouter();
const container: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.id;
const containerName: LocationQueryValue | LocationQueryValue[] =
  router.currentRoute.value.query.name;

const folioRefs: Ref<HTMLElement[]> = ref([]);

const setFolioRef = (el) => {
  if (el) {
    folioRefs.value.push(el);
  }
};

onBeforeUpdate(() => {
  folioRefs.value = [];
});

const uploadToastVisible = ref(false);
const progress = ref(0);
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

const hideUploadToast = () => {
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

async function refresh() {
  useCustomFetch(`/repository/container/folio/list/${container}`)
    .get()
    .json()
    .then((response) => {
      folios.value = response.data.value;
      isLoading.value = false;
    });
}
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
  axios.defaults.timeout = 3600000;
  console.log(axios.defaults.baseURL);
  axios
    .post(
      `/repository/container/folio/upload/${container}?job=Uploading images to ${containerName}`,
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

const selection: Ref<string[]> = ref([]);
function updateSelection(folio: string, add: boolean) {
  if (!add && selection.value.indexOf(folio) != -1) {
    selection.value.splice(selection.value.indexOf(folio), 1);
  } else if (add) {
    selection.value.push(folio);
  }
  checked.value = Object.keys(selection.value).length > 0;
}

function updateTotalSelection(event: Event) {
  if (folioRefs.value) {
    for (const folioRef of folioRefs.value) {
      folioRef.select(event);
    }
  }
}

async function deleteSelected() {
  const payload = {
    ids: [],
  };
  for (const folio of selection.value) {
    payload["ids"].push(folio);
  }
  useCustomFetch(`/repository/container/folio/remove/list/${container}`)
    .post(payload)
    .then((response) => {
      if (!response.error.value) {
        toast.add({
          severity: "success",
          summary: t(
            "pages.repository.container.overview.toast.delete-selected.success.summary",
          ),
          detail: t(
            "pages.repository.container.overview.toast.delete-selected.success.detail",
          ),
          life: 3000,
          group: "general",
        });
        selection.value = [];
        checked.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: t(
            "pages.repository.container.overview.toast.delete-selected.error.summary",
          ),
          detail: t(
            "pages.repository.container.overview.toast.delete-selected.error.detail",
          ),
          life: 3000,
          group: "general",
        });
      }
      refresh();
      toggleDeleteDialog();
    });
}

const selectedSortMode = ref({
  name: t("pages.repository.container.overview.sort.alphabetically-desc"),
  code: "alphabetically-desc",
});
const sortModes = ref([
  {
    name: t("pages.repository.container.overview.sort.alphabetically-asc"),
    code: "alphabetically-asc",
  },
  {
    name: t("pages.repository.container.overview.sort.alphabetically-desc"),
    code: "alphabetically-desc",
  },
]);
function updateSort() {
  switch (selectedSortMode.value.code) {
    case "alphabetically-asc":
      folios.value = folios.value.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
      );
      break;
    case "alphabetically-desc":
      folios.value = folios.value.sort((a, b) =>
        b.name.localeCompare(a.name, "en", { sensitivity: "base" }),
      );
      break;
    default:
      break;
  }
}

const deleteDialogVisible = ref(false);
function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
}

const checked = ref();
const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Repository",
    to: "/repository/overview",
  },
  {
    label: "Images",
    to: "/repository/overview",
  },
  {
    label: containerName,
  },
];

useHead({
  title: containerName,
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

refresh();
</script>
<template>
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    :header="
      t('pages.repository.container.overview.dialog.delete-folio.header')
    "
    :style="{ width: '50vw' }"
  >
    <p class="pb-5 dark:text-surface-200">
      {{ t("pages.repository.container.overview.dialog.delete-folio.content") }}
    </p>
    <button
      type="button"
      class="mb-2 mr-2 rounded-md border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
      @click="toggleDeleteDialog"
    >
      {{
        t(
          "pages.repository.container.overview.dialog.delete-folio.button.cancel",
        )
      }}
    </button>
    <button
      type="button"
      class="mb-2 mr-2 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      @click="deleteSelected"
    >
      {{
        t(
          "pages.repository.container.overview.dialog.delete-folio.button.delete",
        )
      }}
    </button>
  </Dialog>
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
            {{ message.summary }}
          </p>
          <p class="m-0 text-base text-primary-950 dark:text-primary-0">
            {{ message.detail }}
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
  <ComponentContainer spaced>
    <Toolbar>
      <template #start>
        <FileUpload
          ref="fileUpload"
          name="folioUpload[]"
          chooseIcon="pi pi-upload"
          :auto="true"
          :custom-upload="true"
          :multiple="true"
          accept="image/*"
          :max-file-size="1000000000"
          @uploader="uploader"
        >
          <template #header="{ chooseCallback }">
            <Button text @click="chooseCallback()">
              <IconImageUpload class="text-black dark:text-white" />
            </Button>
          </template>
        </FileUpload>
        <Button
          v-tooltip.top="
            $t('pages.repository.container.overview.toolbar.button.delete')
          "
          icon="pi pi-trash"
          @click="toggleDeleteDialog"
          :disabled="selection.length === 0"
          severity="danger"
          text
        />
      </template>
      <template #end>
        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
          <template #option="{ option }">
            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
          </template>
        </SelectButton>
      </template>
    </Toolbar>
    <div v-if="isLoading">
      <Fluid>
        <Skeleton height="30rem" />
      </Fluid>
    </div>
    <DataView
      v-else
      :value="folios"
      :layout="layout"
      paginator
      :rows="20"
      :rows-per-page-options="[5, 10, 15, 20, 25]"
    >
      <template #grid="slotProps">
        <div class="flex space-x-3">
          <p
            class="min-w-fit self-end text-xl font-semibold text-surface-950 dark:text-surface-50"
          >
            {{ t("pages.repository.container.overview.sort-by") }}
          </p>
          <Select
            v-model="selectedSortMode"
            :options="sortModes"
            option-label="name"
            :pt="{
              root: {
                class:
                  'inline-flex relative bg-transparent cursor-pointer self-end',
              },
              input: {
                class: 'text-surface-950 dark:text-surface-50 text-xl',
              },
              trigger: { class: 'hidden' },
            }"
            @change="updateSort"
          />
        </div>
        <div
          class="grid grid-cols-1 content-center justify-center gap-x-2 gap-y-3 @[650px]/content:grid-cols-2 @[950px]/content:grid-cols-3 @[1350px]/content:grid-cols-4"
        >
          <div v-for="(item, index) in slotProps.items" :key="index">
            <FolioCard
              :id="item.id"
              :ref="setFolioRef"
              :key="item.id"
              :name="item.name"
              :format="item.format"
              :keywords="item.keywords"
              :size="item.size"
              :date="item.date"
              :user="item.user"
              :container-id="container"
              @update-selection="updateSelection"
              @refresh="refresh"
            />
          </div>
        </div>
      </template>
      <template #list="slotProps">
        <DataTable :value="slotProps.items" v-model:selection="selection">
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <!--            <Column>
              <template #body="{ data }">
                <Image v-if="imageMap.get(data.id)" :alt="data.name" preview>
                  <template #previewicon>
                    <i class="pi pi-search" style="padding: 100%" @click="loadDetail(data.id)"></i>
                  </template>
                  <template #image>
                    <img :src="imageMap.get(data.id).thumbnail" width="40" alt="image" />
                  </template>
                  <template #preview="slotProps">
                    <img :src="imageMap.get(data.id).detail" class="max-h-screen" alt="preview" :style="slotProps.style" />
                  </template>
                </Image>
                <Skeleton v-else height="2rem"></Skeleton>
              </template>
            </Column>-->
          <Column field="name" header="Name"></Column>
          <Column field="format" header="Format"></Column>
          <Column field="size.height" header="Height"></Column>
          <Column field="size.width" header="Width"></Column>
          <Column field="keywords" header="Keywords"></Column>
          <Column field="date" header="Added">
            <template #body="slotProps">
              <div v-tooltip.left="useLocalDateFormat(slotProps.data.date)">
                <UseTimeAgo
                  v-slot="{ timeAgo }"
                  :time="Date.parse(slotProps.data.date)"
                >
                  {{ timeAgo }}
                </UseTimeAgo>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </DataView>
  </ComponentContainer>
</template>
<style>
.p-fileupload {
  @apply !border-none;
}
.p-fileupload-content {
  @apply !hidden;
}
.p-fileupload-header {
  @apply !border-none !p-0;
}
</style>
