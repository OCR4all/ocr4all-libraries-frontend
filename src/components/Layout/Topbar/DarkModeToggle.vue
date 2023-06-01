<script setup lang="ts">
import { MoonIcon, SunIcon } from "@heroicons/vue/24/solid";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div class="dark-toggle-container mx-3 flex text-sm">
    <button class="text-center" @click="toggleDark()">
      <MoonIcon
        v-if="isDark"
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
      />
      <SunIcon
        v-else
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
      />
    </button>
  </div>
</template>
