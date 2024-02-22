<script setup lang="ts">
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";

const toast = useToast();
import Toast from "primevue/toast";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import axios from "axios";
import { useConfigStore } from "@/stores/config.store";
import { useAuthStore } from "@/stores/auth.store";
import Checkbox from "primevue/checkbox";
const config = useConfigStore();
const auth = useAuthStore();

const folios = ref();
const thumbs = ref({});

const router = useRouter();
const container = router.currentRoute.value.query.id;
const containerName = router.currentRoute.value.query.name;

const uploadToastVisible = ref(false);
const progress = ref(0);
const showUploadToast = () => {
  if (!uploadToastVisible.value) {
    toast.add({
      severity: "custom",
      summary: "Uploading folios",
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
    .catch(function () {
      console.log("error");
    });
};
const selection: Ref<string[]> = ref([]);
function updateSelection(folio: string, add: boolean) {
  if (!add && selection.value.indexOf(folio) != -1) {
    selection.value.splice(selection.value.indexOf(folio), 1);
  } else if (add) {
    selection.value.push(folio);
  }
}

async function deleteSelected() {
  for (const folio of selection.value) {
    await useCustomFetch(
      `/repository/container/folio/remove/entity/${container}?id=${folio}`,
    );
  }
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Folios successfully removed",
    life: 3000,
  });
  await refresh();
}
function toggleSelectAll() {}

const selectedSortMode = ref({
  name: "Name ↓",
  code: "alphabetically-desc",
});
const sortModes = ref([
  {
    name: "Name ↑",
    code: "alphabetically-asc",
  },
  {
    name: "Name ↓",
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

const checked = ref([]);
const breadcrumbHome = { to: "/repository/overview", label: "Repository" };
const breadcrumbCurrent = { label: containerName };
refresh();
</script>
<template>
  <BreadcrumbNavigation :home="breadcrumbHome" :current="breadcrumbCurrent" />
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
        <div class="flex gap-2 justify-self-center">
          <ProgressBar
            :value="progress"
            :show-value="false"
            :style="{ height: '4px' }"
          ></ProgressBar>
          <label class="text-right text-xs text-black dark:text-white"
            >{{ progress }}% uploaded...</label
          >
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
  <div class="m-4 flex space-x-4">
    <FileUpload
      ref="fileUpload"
      name="folioUpload[]"
      choose-label="Upload"
      mode="basic"
      :auto="true"
      :custom-upload="true"
      :multiple="true"
      accept="image/*"
      :pt="{
        chooseButton: {
          class: 'flex bg-primary-600 p-4 text-white cursor-pointer',
        },
      }"
      :max-file-size="100000000"
      @uploader="uploader"
    >
    </FileUpload>
    <button
      class="bg-red-600 p-4 text-primary-0 hover:bg-red-700 disabled:bg-red-400"
      :disabled="selection.length === 0"
      @click="deleteSelected"
    >
      Delete
    </button>
  </div>
  <div class="mx-4 mt-10 flex flex-col space-y-8">
    <h2 class="text-3xl font-bold text-surface-950 dark:text-surface-50">
      All folios
    </h2>
    <div class="align-center flex justify-between">
      <div class="flex space-x-3">
        <p
          class="min-w-fit self-end text-xl font-semibold text-surface-950 dark:text-surface-50"
        >
          Sort by
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
          {{ selection.length }} selected
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
          @update:model-value="toggleSelectAll"
        />
      </div>
    </div>
  </div>
  <hr
    class="mb-6 mt-2 h-0.5 border-t-0 bg-surface-300 opacity-40 dark:opacity-20"
  />
  <Suspense>
    <div
      class="3xl:grid-cols-5 grid grid-cols-1 content-center justify-center gap-x-2 gap-y-3 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4"
    >
      <FolioCard
        v-for="folio in folios"
        :id="folio.id"
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
    <template #fallback> Loading folios... </template>
  </Suspense>
</template>
