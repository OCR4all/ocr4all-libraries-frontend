<script setup lang="ts">
const props = defineProps<{
  header: string;
}>();
</script>
<template>
  <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 place-content-between hover:bg-surface-100 hover:dark:bg-surface-800">
    <dt class="text-sm font-medium text-surface-600 dark:text-surface-300">
       {{ props.header }}
    </dt>
    <dd class="mt-1 text-sm text-surface-900 dark:text-surface-100 sm:mt-0 sm:col-span-2 place-self-end">
      <slot name="content"></slot>
    </dd>
  </div>
</template>
