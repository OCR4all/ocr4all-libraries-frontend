<script setup lang="ts">
const props = defineProps<{
  border?: boolean;
}>();
</script>
<template>
  <div
    class="@container/content rounded-md border border-surface-200 bg-surface-0 p-2 dark:border-surface-800 dark:bg-surface-900"
    :class="[props.border ? 'lg:border' : 'lg:border-none']"
  >
    <slot />
  </div>
</template>
