<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
</script>

<template>
  <AppLayout>
    <div class="bg-surface-0 p-4 @container/content dark:bg-surface-800">
      <div class="grid grid-cols-1 gap-x-4 gap-y-4 @xl/content:grid-cols-3">
        <div
          class="group flex h-full flex-1 flex-col justify-center rounded-md bg-surface-100 p-5 shadow-md hover:bg-blue-700 dark:bg-surface-900 hover:dark:bg-primary-800"
        >
          <div class="flex flex-col">
            <div
              class="truncate text-center text-lg font-bold text-surface-900 group-hover:text-white dark:text-surface-100"
            >
              Calamari
            </div>
          </div>
        </div>

        <div
          class="group flex h-full flex-1 flex-col justify-center rounded-md bg-surface-100 p-5 shadow-md hover:bg-blue-700 dark:bg-surface-900 hover:dark:bg-primary-800"
        >
          <div class="flex flex-col">
            <div
              class="truncate text-center text-lg font-bold text-surface-900 group-hover:text-white dark:text-surface-100"
            >
              Kraken
            </div>
          </div>
        </div>
        <div
          class="group flex h-full flex-1 flex-col justify-center rounded-md bg-surface-100 p-5 shadow-md hover:bg-blue-700 dark:bg-surface-900 hover:dark:bg-primary-800"
        >
          <div class="flex flex-col">
            <div
              class="truncate text-center text-lg font-bold text-surface-900 group-hover:text-white dark:text-surface-100"
            >
              Tesseract
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
