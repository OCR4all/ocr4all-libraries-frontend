<script setup lang="ts">
import { BellIcon } from "@heroicons/vue/24/solid";
import Popover from "primevue/popover";

const notificationPanel: Ref<typeof Popover | undefined> = ref();

const toggle = (event: Event) => {
  if (notificationPanel.value) notificationPanel.value.toggle(event);
};
</script>
<template>
  <div
    class="self-align-middle group flex px-2 text-sm hover:rounded-md hover:bg-surface-200/50 dark:hover:bg-surface-800/50"
  >
    <button class="text-center" @click="toggle">
      <BellIcon
        aria-hidden="true"
        class="h-6 w-6 flex-shrink-0 text-surface-500 transition duration-75 group-hover:text-surface-700 dark:text-surface-400 dark:group-hover:text-white"
      />
    </button>
    <Popover ref="notificationPanel">
      <p class="text-primary-950 dark:text-primary-50">No notifications yet</p>
    </Popover>
  </div>
</template>
