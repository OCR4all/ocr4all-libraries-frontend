<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const user = ref();
await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    user.value = response.data.value;
  });
</script>
<template>
  <div
    class="flex h-full flex-col rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <div class="flex items-center gap-4">
      <AvatarInitials :name="user.name" :admin="true" size="xl" />
      <div class="font-medium dark:text-white">
        <div class="font-bold">{{ user.login }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>
