<script setup lang="ts">
defineProps<{
  home?: object;
  path?: object[];
  current?: object;
}>();
</script>
<template>
  <nav class="flex pb-5" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li>
        <div class="flex items-center">
          <RouterLink
            :to="home.to"
            href="#"
            class="unstyled bg-ml-1 text-sm font-medium text-surface-700 hover:text-primary-600 dark:text-surface-200 dark:hover:text-white md:ml-2"
            >{{ home.label }}</RouterLink
          >
        </div>
      </li>
      <li v-for="entry of path" :key="entry.label">
        <div class="flex items-center">
          <svg
            aria-hidden="true"
            class="h-6 w-6 text-surface-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <RouterLink
            :to="entry.to"
            class="ml-1 text-sm font-medium text-surface-600 hover:text-primary-600 dark:text-surface-300 dark:hover:text-white md:ml-2"
          >
            {{ entry.label }}</RouterLink
          >
        </div>
      </li>
      <li aria-current="page">
        <div class="flex items-center">
          <svg
            aria-hidden="true"
            class="h-6 w-6 text-surface-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span
            class="ml-1 text-sm font-medium text-surface-500 dark:text-surface-400 md:ml-2"
            >{{ current.label }}</span
          >
        </div>
      </li>
    </ol>
  </nav>
</template>
