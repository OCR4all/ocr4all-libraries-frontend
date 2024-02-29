<script setup lang="ts">
import OverlayPanel from "primevue/overlaypanel";

import { BellIcon } from "@heroicons/vue/24/solid";

const notificationPanel: Ref<OverlayPanel | undefined> = ref();

const toggle = (event: Event) => {
  if(notificationPanel.value) notificationPanel.value.toggle(event);
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
    <OverlayPanel ref="notificationPanel">
      <p class="text-primary-950 dark:text-primary-50">No notifications yet</p>
    </OverlayPanel>
  </div>
</template>
