<script setup lang="ts">
import {useUiStore} from "@/stores/ui.store";
import {LocationQueryValue, Router} from "vue-router";
import {useCustomFetch} from "@/composables/useCustomFetch";
import InputText from "primevue/inputtext";
import {FilterMatchMode} from "@primevue/core/api";
import { useToast } from "primevue/usetoast";


import IconUpload from "~icons/fluent/arrow-upload-24-filled";
import FileUpload, {FileUploadUploaderEvent} from "primevue/fileupload";
import Button from "primevue/button";
import axios from "axios";
import {useI18n} from "vue-i18n";
import {useAuthStore} from "@/stores/auth.store";

const models = ref([])

const router: Router = useRouter();
const model: LocationQueryValue | LocationQueryValue[] =
    router.currentRoute.value.query.id;
const modelName: LocationQueryValue | LocationQueryValue[] =
    router.currentRoute.value.query.name;

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Repository",
    to: "/repository/overview",
  },
  {
    label: "Models",
    to: "/repository/overview",
  },
  {
    label: modelName,
  },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

async function refetch() {
  useCustomFetch(`/assemble/model/file/${model}`)
      .json()
      .then((response) => {
        models.value = response.data.value["file-names"].map(value => ({ name: value }));
      });
}

const { t } = useI18n();

const toast = useToast()

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

const auth = useAuthStore()

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
          `/assemble/model/upload/${model}`,
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
        refetch();
        hideUploadToast();
      })
      .catch(function (error) {
        console.log(error);
      });
};

refetch()
</script>
<template>
  <ComponentContainer spaced>
    <Toolbar>
      <template #start>
        <FileUpload
            ref="modelUpload"
            name="modelUpload"
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
    <DataTable :value="models" :filters="filters">
      <Column field="name" header="Model" />
    </DataTable>
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