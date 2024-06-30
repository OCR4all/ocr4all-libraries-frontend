<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import {useAuthStore} from "@/stores/auth.store";

const authStore = useAuthStore()

const user = ref();
await useCustomFetch(`/account`)
    .get()
    .json()
    .then((response) => {
      user.value = response.data.value;
    });
</script>
<template>
  <h1 class="text-2xl font-bold text-black dark:text-white">
    User Settings
  </h1>
  <div class="grid grid-cols-3">
    <div class="col-1">
        <div
            class="group flex h-full flex-1 flex-col justify-center rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <div class="flex flex-col">
            <div class="self-center">
              <AvatarInitials :name="user.name" :admin="false" />
            </div>
            <div
                class="truncate pt-8 text-center text-lg font-bold text-surface-900 group-hover:text-white dark:text-surface-100"
            >
              {{ user.name }}
            </div>
          </div>
        </div>
    </div>
    <div class="col-2">

    </div>
  </div>
</template>