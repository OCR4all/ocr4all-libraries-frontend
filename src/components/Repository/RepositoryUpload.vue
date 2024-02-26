<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import FileUpload, { FileUploadUploaderEvent } from "primevue/fileupload";
import { useCustomFetch } from "@/composables/useCustomFetch";
const toast = useToast();
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useConfigStore } from "@/stores/config.store";
const auth = useAuthStore();
const fileUpload = ref();
const config = useConfigStore();

const progress = ref();

const uploader = async function customUploader(event: FileUploadUploaderEvent) {
  const formData = new FormData();

  const filesToHandle = Array.isArray(event.files)
    ? event.files
    : [event.files];
  for (const file of filesToHandle) {
    // Add Mime Type validation
    formData.append("files", file);
  }
  axios
    .post(
      `${config.baseUrl}/repository/container/folio/upload/d31c2840-c28c-4220-86bf-a8a80fe36ee4`,
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
      console.log("SUCCESS!!");
    })
    .catch(function () {
      console.log("FAILURE!!");
    });
};
</script>
<template>
  <div class="card">
    <Toast />
    <FileUpload
      ref="fileUpload"
      name="folioUpload[]"
      mode="advanced"
      :customUpload="true"
      @uploader="uploader"
      :multiple="true"
      accept="image/*"
      :maxFileSize="100000000"
    >
      <template #empty>
        <div class="flex w-full items-center justify-center">
          <label
            class="dark:hover:bg-bray-800 flex h-64 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-surface-300 bg-surface-50 hover:bg-surface-100 dark:border-surface-600 dark:bg-surface-700 dark:hover:border-surface-500 dark:hover:bg-surface-600"
          >
            <div class="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                class="mb-4 h-8 w-8 text-surface-500 dark:text-surface-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-surface-500 dark:text-surface-400">
                <span class="font-semibold">Click the button above</span> or
                drag and drop
              </p>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                JPG, PNG or TIFF
              </p>
            </div>
          </label>
        </div>
      </template>
    </FileUpload>
  </div>
</template>
