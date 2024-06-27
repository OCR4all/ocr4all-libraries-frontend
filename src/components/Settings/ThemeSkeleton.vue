<script setup lang="ts">
const props = defineProps<{
  theme: string;
  active: string;
}>();
</script>
<template>
  <div v-show="props.theme === 'light'" class="space-y-2">
    <div
      class="flex cursor-pointer rounded-md border bg-surface-100 p-4 hover:border-2 hover:border-primary-400 dark:border-surface-600 dark:hover:border-primary-400"
    >
      <div class="flex-shrink-0">
        <span class="size-12 block rounded-full bg-surface-800"></span>
      </div>

      <div class="w-full">
        <svg
          class="h-10 w-10 text-surface-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path
            d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
          />
        </svg>

        <ul class="mt-5 space-y-3">
          <li class="h-4 w-full rounded-full border bg-surface-0"></li>
          <li class="h-4 w-full rounded-full border bg-surface-0"></li>
          <li class="h-4 w-full rounded-full border bg-surface-0"></li>
          <li class="h-4 w-full rounded-full border bg-surface-0"></li>
        </ul>
      </div>
    </div>
    <p class="text-center text-surface-900 dark:text-surface-0">Light</p>
  </div>
  <div v-show="props.theme === 'dark'" class="space-y-2">
    <div
      class="flex cursor-pointer rounded-md border bg-surface-900 p-4 hover:border-2 hover:border-primary-400 dark:border-surface-600 dark:hover:border-primary-400"
    >
      <div class="flex-shrink-0">
        <span
          class="size-12 block rounded-full border-surface-600 bg-surface-800"
        ></span>
      </div>

      <div class="w-full">
        <svg
          class="h-10 w-10 text-surface-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path
            d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
          />
        </svg>

        <ul class="mt-5 space-y-3">
          <li
            class="h-4 w-full rounded-full border border-surface-600 bg-surface-800"
          ></li>
          <li
            class="h-4 w-full rounded-full border border-surface-600 bg-surface-800"
          ></li>
          <li
            class="h-4 w-full rounded-full border border-surface-600 bg-surface-800"
          ></li>
          <li
            class="h-4 w-full rounded-full border border-surface-600 bg-surface-800"
          ></li>
        </ul>
      </div>
    </div>
    <p class="text-center text-surface-900 dark:text-surface-0">Dark</p>
  </div>
  <div v-show="props.theme === 'system'" class="space-y-2">
    <div
      class="flex cursor-pointer rounded-md border hover:border-2 hover:border-primary-400 dark:border-surface-600 dark:hover:border-primary-400"
    >
      <div class="w-1/2 rounded-l-md bg-surface-100 pb-4 pl-4 pt-4">
        <svg
          class="h-10 w-10 text-surface-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path
            d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
          />
        </svg>

        <ul class="mt-5 space-y-3">
          <li class="h-4 w-full rounded-l-full border bg-surface-0"></li>
          <li class="h-4 w-full rounded-l-full border bg-surface-0"></li>
          <li class="h-4 w-full rounded-l-full border bg-surface-0"></li>
          <li class="h-4 w-full rounded-l-full border bg-surface-0"></li>
        </ul>
      </div>
      <div class="w-1/2 rounded-r-md bg-surface-900 pb-4 pr-4 pt-4">
        <div class="flex justify-end">
          <svg
            class="h-10 w-10 text-surface-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
        </div>
        <ul class="mt-5 space-y-3">
          <li
            class="h-4 w-full rounded-r-full border border-surface-600 bg-surface-800"
          ></li>
          <li
            class="h-4 w-full rounded-r-full border border-surface-600 bg-surface-800"
          ></li>
          <li
            class="h-4 w-full rounded-r-full border border-surface-600 bg-surface-800"
          ></li>
          <li
            class="h-4 w-full rounded-r-full border border-surface-600 bg-surface-800"
          ></li>
        </ul>
      </div>
    </div>
    <p class="text-center text-surface-900 dark:text-surface-0">
      System Default
    </p>
  </div>
</template>
