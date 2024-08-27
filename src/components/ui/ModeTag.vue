<script setup lang="ts">
import IconPro from "~icons/oui/app-graph"
import IconBase from "~icons/mdi/graph-line-shimmer"
import IconAdmin from "~icons/eos-icons/admin-outlined"
import { useAuthStore } from "@/stores/auth.store";
import router from "@/router";

const props = defineProps<{
  mode: string
}>();

const popover = ref()
const authStore = useAuthStore()

function toggle(event: Event) {
  popover.value.toggle(event)
}

function openAdminPanel() {
  router.push({ name: "Admin" })
}

function openProMode() {
  router.push({ name: "Dashboard" })
}
</script>
<template>
  <div
    class="align-center cursor-pointer flex gap-x-2 rounded bg-blue-100 px-2.5 py-2 text-sm font-bold text-surface-700 dark:bg-blue-900 dark:text-surface-100"
    @click="toggle"
  >
    <div v-if="props.mode === 'pro'" class="flex space-x-2">
      <IconPro class="self-center" />
      <p class="self-center">Pro</p>
    </div>
    <div v-else-if="props.mode === 'admin'" class="flex space-x-2">
      <IconAdmin class="self-center" />
      <p class="self-center">Administration</p>
    </div>
  </div>
  <Popover ref="popover">
    <div class="flex flex-col gap-y-1">
      <Button severity="primary" :disabled="true" text>
        <div class="flex w-full text-black dark:text-white justify-start space-x-2">
          <IconBase class="self-center" />
          <p class="self-center">Base</p>
          <Tag value="Coming soon" />
        </div>
      </Button>
      <Button v-show="props.mode !== 'pro'" severity="primary" text @click="openProMode()">
        <div class="flex w-full text-black dark:text-white justify-start space-x-2">
          <IconPro class="self-center" />
          <p class="self-center">Pro</p>
        </div>
      </Button>
      <Button v-show="props.mode !== 'admin' && authStore.isAdmin" severity="primary" text @click="openAdminPanel()">
        <div class="flex w-full text-black dark:text-white justify-start space-x-2">
          <IconAdmin class="self-center" />
          <p class="self-center">Administration</p>
        </div>
      </Button>
    </div>
  </Popover>
</template>
