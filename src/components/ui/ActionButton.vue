<script setup lang="ts">
defineProps<{
  rounded?: boolean;
  size?: string;
  type?: string;
}>();
</script>

<template>
  <button
    type="button"
    :class="{
      'rounded-md': rounded,
      'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300 disabled:bg-primary-400 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 dark:disabled:bg-primary-400':
        type === 'primary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 disabled:bg-red-400 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 dark:disabled:bg-red-400':
        type === 'delete',
      'text-surface-800 dark:text-surface-300': type === 'cancel',
      'px-5 py-3 text-base font-medium': size === 'large',
      'p-2': size === 'small',
    }"
    class="text-center focus:outline-none focus:ring-4 p-ripple"
  >
    <slot />
  </button>
</template>
