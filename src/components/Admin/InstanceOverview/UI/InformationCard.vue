<script setup lang="ts">
const props = defineProps<{
  header: string;
}>();
</script>
<template>
  <div
    class="rounded-md bg-surface-0 dark:border-surface-800 dark:bg-surface-900 lg:border"
  >
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100">
        {{ props.header }}
      </h3>
    </div>
    <div
      class="border-t border-surface-200 px-4 py-5 dark:border-surface-800 sm:p-0"
    >
      <dl class="sm:divide-y sm:divide-surface-200 dark:sm:divide-surface-800">
        <slot name="content"></slot>
      </dl>
    </div>
  </div>
</template>
