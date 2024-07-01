<script setup lang="ts">

import { useAuthStore } from "@/stores/auth.store";
import {useCustomFetch} from "@/composables/useCustomFetch";

const user = ref()
await useCustomFetch(`/account`)
    .get()
    .json()
    .then((response) => {
      user.value = response.data.value;
    });

</script>
<template>
  <div
    class="flex flex-col h-full rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <AvatarInitials :name="user.name" :admin="true" />
    <div>
      <p>{{ user.login }}</p>
      <p class="font-bold">{{ user.name }}</p>
    </div>
  </div>
</template>
