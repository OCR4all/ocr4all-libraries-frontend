<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";

useHead({
  title: "OCR-D API Viewer",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
    <div
        class="flex h-full flex-col items-center justify-center px-6"
    >
      <div class="mx-auto text-center">
        <h1
            class="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white"
        >
          Please establish a tunnel to the OCR-D API
        </h1>
      </div>
    </div>
</template>
