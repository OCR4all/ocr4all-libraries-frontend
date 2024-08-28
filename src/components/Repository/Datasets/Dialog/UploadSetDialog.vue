<script setup lang="ts">
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth.store";

const { t } = useI18n();
const toast = useToast();

const uploadToastVisible = ref(false);
const progress = ref(0);
const auth = useAuthStore()

const dataset = ref()

const dialogRef = inject("dialogRef");
onMounted(() => {
  dataset.value = dialogRef.value.data;
});

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
  axios
    .post(`data/collection/set/upload/${dataset.value.collection}`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        progress.value = parseInt(
          String(
            Math.round((progressEvent.loaded / progressEvent.total) * 100),
          ),
        );
      },
    })
    .then(function () {
      fileUpload.value.clear();
      fileUpload.value.uploadedFileCount = 0;
/*      dialogRef.value.close()*/
    })
    .catch(function (error) {
      console.log(error);
    });
};

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const $primevue = usePrimeVue();

const onTemplatedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
</script>
<template>
  <FileUpload
    ref="fileUpload"
    name="folioUpload[]"
    :custom-upload="true"
    :multiple="true"
    :max-file-size="1000000000"
    @uploader="uploader"
  >
    <template
      #header="{ chooseCallback, uploadCallback, clearCallback, files }"
    >
      <div class="flex flex-1 flex-wrap items-center justify-between gap-4">
        <div class="flex gap-2">
          <Button
            @click="chooseCallback()"
            icon="pi pi-images"
            rounded
            outlined
            severity="secondary"
          ></Button>
          <Button
            @click="uploadEvent(uploadCallback)"
            icon="pi pi-cloud-upload"
            rounded
            outlined
            severity="success"
            :disabled="!files || files.length === 0"
          ></Button>
          <Button
            @click="clearCallback()"
            icon="pi pi-times"
            rounded
            outlined
            severity="danger"
            :disabled="!files || files.length === 0"
          ></Button>
        </div>
        <ProgressBar
          :value="totalSizePercent"
          :showValue="false"
          class="md:w-20rem h-1 w-full md:ml-auto"
        >
          <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
        </ProgressBar>
      </div>
    </template>
    <template
      #content="{
        files,
        uploadedFiles,
        removeUploadedFileCallback,
        removeFileCallback,
      }"
    >
      <div class="flex flex-col gap-8 pt-4">
        <div v-if="files.length > 0">
          <h5>Pending</h5>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(file, index) of files"
              :key="file.name + file.type + file.size"
              class="rounded-border flex flex-col items-center gap-4 border border-surface p-8"
            >
              <span
                class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
                >{{ file.name }}</span
              >
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Pending" severity="warn" />
              <Button
                icon="pi pi-times"
                @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Completed</h5>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(file, index) of uploadedFiles"
              :key="file.name + file.type + file.size"
              class="rounded-border flex flex-col items-center gap-4 border border-surface p-8"
            >
              <div>
                <img
                  role="presentation"
                  :alt="file.name"
                  :src="file.objectURL"
                  width="100"
                  height="50"
                />
              </div>
              <span
                class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
                >{{ file.name }}</span
              >
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Completed" class="mt-4" severity="success" />
              <Button
                icon="pi pi-times"
                @click="removeUploadedFileCallback(index)"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex flex-col items-center justify-center">
        <i
          class="pi pi-cloud-upload !text-muted-color !rounded-full !border-2 !p-8 !text-4xl"
        />
        <p class="mb-0 mt-6">Drag and drop files to here to upload.</p>
      </div>
    </template>
  </FileUpload>
</template>
