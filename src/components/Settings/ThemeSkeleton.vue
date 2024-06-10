<script setup lang="ts">
const props = defineProps<{
  theme: string;
  active: string;
}>();
</script>
<template>
  <div
    v-show="props.theme === 'light'" class="space-y-2">
    <div
      class="flex rounded-md p-4 border dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-400 hover:border-2 bg-surface-100 cursor-pointer">
    <div class="flex-shrink-0">
      <span class="size-12 block bg-surface-800 rounded-full"></span>
    </div>

    <div class="w-full">
      <svg class="w-10 h-10 text-surface-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
      </svg>

      <ul class="mt-5 space-y-3">
        <li class="w-full h-4 bg-surface-0 border rounded-full"></li>
        <li class="w-full h-4 bg-surface-0 border rounded-full"></li>
        <li class="w-full h-4 bg-surface-0 border rounded-full"></li>
        <li class="w-full h-4 bg-surface-0 border rounded-full"></li>
      </ul>
    </div>
    </div>
    <p class="text-center text-surface-900 dark:text-surface-0">Light</p>
  </div>
  <div
    v-show="props.theme === 'dark'" class="space-y-2">
    <div
    class="flex rounded-md p-4 border dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-400 hover:border-2 cursor-pointer bg-surface-900">
    <div class="flex-shrink-0">
      <span class="size-12 block border-surface-600 bg-surface-800 rounded-full"></span>
    </div>

    <div class="w-full">
      <svg class="w-10 h-10 text-surface-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
      </svg>

      <ul class="mt-5 space-y-3">
        <li class="w-full h-4 rounded-full border border-surface-600 bg-surface-800"></li>
        <li class="w-full h-4 rounded-full border border-surface-600 bg-surface-800"></li>
        <li class="w-full h-4 rounded-full border border-surface-600 bg-surface-800"></li>
        <li class="w-full h-4 rounded-full border border-surface-600 bg-surface-800"></li>
      </ul>
    </div>
    </div>
    <p class="text-center text-surface-900 dark:text-surface-0">Dark</p>
  </div>
  <div
    v-show="props.theme === 'system'" class="space-y-2">
    <div
    class="flex border rounded-md dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-400 hover:border-2 cursor-pointer">
    <div class="w-1/2 rounded-l-md pl-4 pt-4 pb-4 bg-surface-100">
      <svg class="w-10 h-10 text-surface-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
      </svg>

      <ul class="mt-5 space-y-3">
        <li class="w-full h-4 bg-surface-0 border rounded-l-full"></li>
        <li class="w-full h-4 bg-surface-0 border rounded-l-full"></li>
        <li class="w-full h-4 bg-surface-0 border rounded-l-full"></li>
        <li class="w-full h-4 bg-surface-0 border rounded-l-full"></li>
      </ul>
    </div>
    <div class="w-1/2 rounded-r-md pr-4 pt-4 pb-4 bg-surface-900">
      <div class="flex justify-end">
      <svg class="w-10 h-10 text-surface-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
      </svg>
      </div>
      <ul class="mt-5 space-y-3">
        <li class="w-full h-4 bg-surface-800 border border-surface-600 rounded-r-full"></li>
        <li class="w-full h-4 bg-surface-800 border border-surface-600 rounded-r-full"></li>
        <li class="w-full h-4 bg-surface-800 border border-surface-600 rounded-r-full"></li>
        <li class="w-full h-4 bg-surface-800 border border-surface-600 rounded-r-full"></li>
      </ul>
    </div>
    </div>
    <p class="text-center text-surface-900 dark:text-surface-0">System Default</p>
  </div>
</template>
