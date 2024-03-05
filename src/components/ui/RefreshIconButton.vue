<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["refresh"]);

defineProps<{
  isRefetching: boolean
}>();
</script>

<template>
  <button
    v-tooltip="'Refresh'"
    :disabled="isRefetching"
    @click="emit('refresh')">
    <ArrowPathIcon
      :class="{ 'animate-spin': isRefetching }"
      class="mr-2 inline h-6 w-6 text-surface-600 hover:text-black dark:text-surface-200 hover:dark:text-white"
    />
  </button>
</template>
