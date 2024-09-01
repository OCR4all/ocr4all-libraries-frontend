<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import GeneralInformation from "@/components/Settings/GeneralInformation.vue";
import UserInfoCard from "@/components/Settings/UserInfo.vue";

const user = ref();
await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    user.value = response.data.value;
  });
</script>
<template>
  <div class="flex flex-col space-y-8">
    <h1 class="text-2xl font-bold text-black dark:text-white">User Settings</h1>
    <div class="grid grid-cols-3 items-start gap-4">
      <div class="col-span-3 space-y-4 lg:col-span-1">
        <UserInfoCard />
        <UserSettingsLanguageAndTime />
        <AppearanceSettings />
      </div>
      <div class="col-span-3 space-y-4 lg:col-span-2">
        <GeneralInformation />
        <UserPassword />
        <A11Y />
      </div>
    </div>
  </div>
</template>
