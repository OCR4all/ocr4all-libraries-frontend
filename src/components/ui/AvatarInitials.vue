<script setup lang="ts">
const props = defineProps<{
  name: string;
  status: string;
}>();

const initials = computed(() => {
  const nameParts = props.name.split(" ");
  return `${nameParts[0].charAt(0)}${nameParts[1] ? nameParts[1].charAt(0) : ""}`;
});
</script>
<template>
  <div
    class="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-100 dark:bg-primary-200"
  >
    <span class="text-sm font-medium text-gray-600 dark:text-surface-900">
      {{ initials }}
    </span>
  </div>
</template>
