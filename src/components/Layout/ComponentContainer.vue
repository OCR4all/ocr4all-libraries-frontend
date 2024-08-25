<script setup lang="ts">
const props = defineProps<{
  border?: boolean;
  spaced?: boolean;
}>();
</script>
<template>
  <div
    class="rounded-md border border-surface-200 bg-surface-0 p-2 @container/content dark:border-surface-700 dark:bg-surface-900"
    :class="[
      props.border ? 'lg:border' : 'lg:border-none',
      props.spaced ? 'space-y-4' : 'space-y-0',
    ]"
  >
    <slot />
  </div>
</template>
