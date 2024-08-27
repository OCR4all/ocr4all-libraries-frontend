<script setup lang="ts">
import IconRefresh from "~icons/heroicons/arrow-path"

const emit = defineEmits(["refresh"]);

defineProps<{
  isRefetching: boolean;
}>();
</script>

<template>
  <button
    v-tooltip="'Refresh'"
    :disabled="isRefetching"
    @click="emit('refresh')"
  >
    <IconRefresh
      :class="{ 'animate-spin': isRefetching }"
      class="mr-2 inline h-6 w-6 text-surface-600 hover:text-black dark:text-surface-200 hover:dark:text-white"
    />
  </button>
</template>
