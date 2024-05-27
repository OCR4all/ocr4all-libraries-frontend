<script setup lang="ts">
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";

const toast: ToastServiceMethods = useToast();
import Toast from "primevue/toast";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import axios from "axios";
import { useConfigStore } from "@/stores/config.store";
import { useAuthStore } from "@/stores/auth.store";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import { LocationQueryValue, Router } from "vue-router";
import { ToastServiceMethods } from "primevue/toastservice";
import { Store } from "pinia";
import { useI18n } from "vue-i18n";
const config: Store = useConfigStore();
const auth: Store = useAuthStore();

const { t } = useI18n();

const folios = ref();
const thumbs = ref({});

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

async function refresh() {
  const { data } = await useCustomFetch(
    `/repository/container/folio/list/${container}`,
  ).json();
  folios.value = data.value;

  for (const folio of folios.value) {
    useCustomFetch(
      `/repository/container/folio/derivative/best/${container}?id=${folio.id}`,
    )
      .get()
      .blob()
      .then((response) => {
        thumbs.value[folio.id] = useObjectUrl(response.data.value);
      });
  }
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
  axios.defaults.timeout = 100000;
  axios
    .post(
      `${config.baseUrl}/repository/container/folio/upload/${container}`,
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
const breadcrumbHome = { to: "/repository/overview", label: "Repository" };
const breadcrumbCurrent = { label: containerName };
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
      class="mb-2 mr-2 rounded-md border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-850 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
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
  <Toast />
  <Toast
    position="top-center"
    group="headless"
    @close="uploadToastVisible = false"
  >
    <template #container="{ message, closeCallback }">
      <section
        class="grid w-full justify-center gap-3 p-3"
        style="border-radius: 10px"
      >
        <div class="flex w-full gap-3 justify-self-center">
          <i
            class="pi pi-cloud-upload text-2xl text-primary-950 dark:text-primary-0"
          ></i>
          <p
            class="m-0 text-base font-semibold text-primary-950 dark:text-primary-0"
          >
            {{ message.summary }}
          </p>
          <p class="m-0 text-base text-primary-950 dark:text-primary-0">
            {{ message.detail }}
          </p>
        </div>
        <div v-if="progress < 100">
          <ProgressBar :value="progress"></ProgressBar>
        </div>
        <div
          v-else-if="progress === 100"
          class="flex flex-col justify-center space-y-2"
        >
          <ProgressBar mode="indeterminate"></ProgressBar>
          <p
            class="self-center font-semibold text-surface-950 dark:text-surface-50"
          >
            Finalizing upload
          </p>
        </div>
        <div class="mb-3 flex gap-3 justify-self-center">
          <Button
            label="Close"
            text
            class="px-2 py-1"
            @click="closeCallback"
          ></Button>
        </div>
      </section>
    </template>
  </Toast>
  <div
    class="rounded-xl bg-surface-0 p-4 @container/content dark:bg-surface-850"
  >
    <div class="m-4 flex space-x-4">
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
        accept="image/*"
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
      <button
        class="rounded-md bg-red-600 p-4 text-primary-0 hover:bg-red-700 disabled:bg-red-400"
        :disabled="selection.length === 0"
        @click="toggleDeleteDialog"
      >
        {{ t("pages.repository.container.overview.toolbar.button.delete") }}
      </button>
    </div>
    <div class="mx-4 mt-10 flex flex-col space-y-8">
      <h2 class="text-3xl font-bold text-surface-950 dark:text-surface-50">
        {{ t("pages.repository.container.overview.all-folios") }}
      </h2>
      <div class="align-center flex justify-between">
        <div class="flex space-x-3">
          <p
            class="min-w-fit self-end text-xl font-semibold text-surface-950 dark:text-surface-50"
          >
            {{ t("pages.repository.container.overview.sort-by") }}
          </p>
          <Dropdown
            v-model="selectedSortMode"
            :options="sortModes"
            option-label="name"
            :pt="{
              root: {
                class:
                  'inline-flex relative bg-transparent cursor-pointer self-end',
              },
              input: { class: 'text-surface-950 dark:text-surface-50 text-xl' },
              trigger: { class: 'hidden' },
            }"
            @change="updateSort"
          />
        </div>
        <div class="relative flex items-center space-x-2 space-y-2">
          <p
            v-show="selection.length"
            class="self-center font-bold text-surface-950 dark:text-surface-50"
          >
            {{ selection.length }}
            {{ t("pages.repository.container.overview.selected") }}
          </p>
          <Checkbox
            v-model="checked"
            :binary="true"
            :pt="{
              root: { class: 'z-50 pb-4' },
              input: {
                class:
                  'peer absolute h-6 w-6 border border-solid cursor-pointer hover:bg-primary-200',
              },
            }"
            @update:model-value="updateTotalSelection"
          />
        </div>
      </div>
    </div>
    <hr
      class="mb-6 mt-2 h-0.5 border-t-0 bg-surface-300 opacity-40 dark:opacity-20"
    />
    <Suspense>
      <div
        class="grid grid-cols-1 content-center justify-center gap-x-2 gap-y-3 @[550px]/content:grid-cols-2 @[800px]/content:grid-cols-3 @[1050px]/content:grid-cols-4"
      >
        <FolioCard
          v-for="folio in folios"
          :id="folio.id"
          :ref="setFolioRef"
          :key="folio.id"
          :src="thumbs[folio.id]"
          :name="folio.name"
          :format="folio.format"
          :keywords="folio.keywords"
          :size="folio.size"
          :date="folio.date"
          :user="folio.user"
          :container-id="container"
          @update-selection="updateSelection"
          @refresh="refresh"
        />
      </div>
      <template #fallback>
        {{ t("pages.repository.container.overview.fallback-cards") }}
      </template>
    </Suspense>
  </div>
</template>
