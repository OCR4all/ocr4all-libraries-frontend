<script setup lang="ts">
const props = defineProps<{
  name: string;
  status: string;
}>();

const initials = computed(() => {
  const nameParts = props.name.split(" ")
  return `${nameParts[0].charAt(0)}${nameParts[1] ? nameParts[1].charAt(0) : ''}`;
})
</script>
<template>
  <div class="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-primary-100 rounded-full dark:bg-primary-200">
    <span class="text-sm font-medium text-gray-600 dark:text-surface-900">
      {{ initials }}
    </span>
  </div>
</template>
