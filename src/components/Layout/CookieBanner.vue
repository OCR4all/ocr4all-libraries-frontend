<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
const preferenceDialogVisible = ref(false);
</script>
<template>
  <Dialog
    v-model:visible="preferenceDialogVisible"
    modal
    header="Cookie Policy"
    :style="{ width: '25rem' }"
  >
    <div class="justify-content-end flex gap-2">
      <Button
        type="button"
        label="Close"
        severity="secondary"
        @click="preferenceDialogVisible = false"
      ></Button>
    </div>
  </Dialog>
  <section
    v-show="uiStore.cookieBannerVisible"
    class="fixed bottom-16 left-12 z-[999] mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
  >
    <h2 class="font-semibold text-surface-800 dark:text-white">
      🍪 {{ $t("cookie.banner.header") }}
    </h2>

    <p class="mt-4 text-sm text-surface-600 dark:text-surface-300">
      {{ $t("cookie.banner.content") }}
      <a
        @click="preferenceDialogVisible = true"
        class="cursor-pointer text-blue-500 hover:underline"
      >
        {{ $t("cookie.banner.policy") }}
      </a>
    </p>

    <div class="mt-4 flex shrink-0 items-center justify-end gap-x-4">
      <button
        class="rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-primary-900 focus:outline-none dark:bg-primary-600"
        @click="uiStore.cookieBannerVisible = false"
      >
        {{ $t("cookie.banner.button") }}
      </button>
    </div>
  </section>
</template>
