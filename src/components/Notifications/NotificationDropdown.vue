<script setup lang="ts">
import { BellIcon } from "@heroicons/vue/24/solid";
import Popover from "primevue/popover";

const notificationPanel: Ref<typeof Popover | undefined> = ref();

const toggle = (event: Event) => {
  if (notificationPanel.value) notificationPanel.value.toggle(event);
};
</script>
<template>
  <div class="dark-toggle-container mx-2 flex text-sm">
    <button class="text-center" @click="toggle">
      <BellIcon
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 text-surface-500 transition duration-75 group-hover:text-surface-900 dark:text-surface-400 dark:group-hover:text-white"
      />
    </button>
    <Popover ref="notificationPanel">
      <p class="text-primary-950 dark:text-primary-50">No notifications yet</p>
    </Popover>
  </div>
</template>
