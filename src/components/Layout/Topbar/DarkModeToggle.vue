<script setup lang="ts">
import SunIcon from "~icons/line-md/moon-to-sunny-outline-transition";
import MoonIcon from "~icons/line-md/moon-filled"

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div
    class="self-align-middle group flex px-2 text-sm hover:rounded-md hover:bg-surface-200/50 dark:hover:bg-surface-800/50"
  >
    <button @click="toggleDark()">
      <MoonIcon
        v-if="isDark"
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 transition duration-75 dark:text-surface-400 dark:group-hover:text-surface-100"
      />
      <SunIcon
        v-else
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 text-surface-500 transition duration-75 group-hover:text-surface-700"
      />
    </button>
  </div>
</template>
