<script setup lang="ts">
const props = defineProps<{
  header: string;
}>();
</script>
<template>
  <div class="bg-surface-0 dark:bg-surface-900 lg:border dark:border-surface-800 rounded-md">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100">
        {{ props.header }}
      </h3>
    </div>
    <div class="border-t border-surface-200 dark:border-surface-800 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-surface-200 dark:sm:divide-surface-800">
        <slot name="content"></slot>
      </dl>
    </div>
  </div>
</template>
