<script setup lang="ts">
const instanceTag = import.meta.env.VITE_INSTANCE_TAG;
</script>
<template>
  <span
    v-show="instanceTag"
    class="me-2 rounded bg-red-100 px-2.5 py-2 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-100"
    >{{ instanceTag }}</span
  >
</template>
