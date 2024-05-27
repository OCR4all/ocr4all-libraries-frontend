<script setup lang="ts">
const instanceTag = import.meta.env.VITE_INSTANCE_TAG;

</script>
<template>
  <span v-show="instanceTag" class="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-2 rounded dark:bg-red-900 dark:text-red-100">{{ instanceTag }}</span>
</template>
