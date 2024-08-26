<script setup lang="ts">
const props = defineProps<{
  border?: boolean;
  spaced?: boolean;
  internal?: boolean;
}>();
</script>
<template>
  <div
    class="@container/content rounded-md bg-surface-0 p-2 dark:bg-surface-900"
    :class="[
      !props.internal ? 'border border-surface-200 dark:border-surface-700' : 'border-none',
      props.border ? 'lg:border' : 'lg:border-none',
      props.spaced ? 'space-y-4' : 'space-y-0',
    ]"
  >
    <slot />
  </div>
</template>
