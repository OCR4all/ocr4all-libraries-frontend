<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";

const store = useUiStore();
</script>
<template>
  <nav v-if="store.breadcrumb" class="justify-between hidden lg:flex px-4 py-3 lg:p-0 border lg:border-none border-gray-200 rounded-lg bg-surface-0 lg:bg-surface-0 dark:bg-surface-800 lg:dark:bg-surface-900 dark:border-gray-700" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse sm:mb-0">
      <li v-for="(item, index) in store.breadcrumb" :key="item.label" class="inline-flex items-center">
        <span v-show="index != 0" class="mx-1 text-gray-500 dark:text-gray-300 rtl:-scale-x-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </span>
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="unstyled text-md font-medium text-surface-700 hover:text-primary-600 dark:text-surface-100 dark:hover:text-white"
          :class="[index === store.breadcrumb.length - 1 ? 'font-semibold' : 'font-medium']"
        >{{ item.label }}</RouterLink>
        <p
          v-else
          class="text-md text-surface-700 dark:text-surface-100"
          :class="[index === store.breadcrumb.length - 1 ? 'font-semibold' : 'font-medium']">
          {{ item.label }}
        </p>
      </li>
    </ol>
  </nav>
</template>
