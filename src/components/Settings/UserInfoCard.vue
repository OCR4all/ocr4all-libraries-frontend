<script setup lang="ts">

import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore()
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900 space-y-4"
  >
    <AvatarInitials name="Herbert Baier" :admin="true" />
    <div>
      <p>{{ authStore.user }}</p>
      <p>{{ authStore }}</p>
    </div>
  </div>
</template>
