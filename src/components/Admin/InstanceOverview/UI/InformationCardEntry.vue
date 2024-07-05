<script setup lang="ts">
const props = defineProps<{
  header: string;
}>();
</script>
<template>
  <div
    class="place-content-between py-3 hover:bg-surface-100 hover:dark:bg-surface-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
  >
    <dt class="text-sm font-medium text-surface-600 dark:text-surface-300">
      {{ props.header }}
    </dt>
    <dd
      class="mt-1 place-self-end text-sm text-surface-900 dark:text-surface-100 sm:col-span-2 sm:mt-0"
    >
      <slot name="content"></slot>
    </dd>
  </div>
</template>
