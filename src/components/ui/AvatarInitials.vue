<script setup lang="ts">
import { useStringToHexColor } from "@/composables/useStringToHexColor";

const props = defineProps<{
  name: string;
  admin: boolean;
  small?: boolean;
}>();

const initials = computed(() => {
  const nameParts = props.name.split(" ");
  return `${nameParts[0].charAt(0)}${nameParts[1] ? nameParts[1].charAt(0) : ""}`;
});
</script>
<template>
  <div
    class="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary-100 dark:bg-primary-200"
    :class="[small ? 'h-4 w-4' : 'h-8 w-8']"
  >
    <span
      class="font-medium text-gray-600 dark:text-surface-900"
      :class="[small ? 'text-[6px]' : 'text-sm']"
    >
      {{ initials }}
    </span>
  </div>
</template>
