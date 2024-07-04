<script setup lang="ts">
import { MoonIcon, SunIcon } from "@heroicons/vue/24/solid";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div class="flex group px-2 text-sm self-align-middle hover:bg-surface-200/50 dark:hover:bg-surface-800/50 hover:rounded-md">
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
