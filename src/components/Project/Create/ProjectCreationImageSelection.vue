<script setup lang="ts">
import { CloudArrowUpIcon, FolderPlusIcon } from "@heroicons/vue/24/outline";

import { useProjectCreationStore } from "@/stores/projectCreation.store";

import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();

const store = useProjectCreationStore();

async function importFromExchange() {
  const payload = {
    id: "de.uniwuerzburg.zpd.ocr4all.application.core.spi.imp.provider.ImageImport",
    strings: [{ argument: "source-folder", value: "images" }],
    selects: [
      { argument: "image-formats", values: ["tif", "png", "jpg", "jpeg"] },
    ],
  };

  const data = await useCustomFetch(`/spi/import/schedule/${store.projectId}`)
    .post(payload)
    .json();
  router.push("/project/overview");
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center space-y-10 dark:text-gray-100 sm:p-12"
  >
    <h2
      class="mb-2 text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.new.components.images.directive") }}
    </h2>
    <div class="flex">
      <button
        @click="importFromExchange"
        type="button"
        class="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-8 py-5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <FolderPlusIcon class="mr-2 h-5 w-5" />
        {{ $t("pages.projects.new.components.images.buttons.exchange") }}
      </button>
      <button
        disabled
        type="button"
        class="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-8 py-5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:bg-blue-400"
      >
        <CloudArrowUpIcon class="mr-2 h-5 w-5" />
        {{ $t("pages.projects.new.components.images.buttons.upload") }}
      </button>
    </div>
  </div>

  <div
    class="flex flex-col items-center justify-center space-y-10 dark:text-gray-100 sm:p-12"
  >
    <div class="flex items-center justify-between sm:col-span-6">
      <button
        class="inline-block rounded-lg bg-gray-400 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-600 focus-visible:ring active:bg-gray-700 md:text-base"
        @click="router.push('/project/overview')"
      >
        {{ $t("pages.projects.new.components.images.buttons.complete") }}
      </button>
    </div>
  </div>
</template>
