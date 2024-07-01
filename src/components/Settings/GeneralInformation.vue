<script setup lang="ts">
import { generalInformation } from "@/components/Settings/Schema/generalInformation";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useAuthStore } from "@/stores/auth.store";

const schema = generalInformation
const data = ref()

const authStore = useAuthStore()

async function updateGeneralInformation(values, { setErrors }) {
  const payload = {
    login: data.value.login,
    state: data.value.state,
    email: data.value.email,
    name: data.value.name,
  };
  useCustomFetch(`/administration/security/user/update`)
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        // Toast
      }
    });
}
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900 space-y-4"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">General Information</h1>
    <FormKit
      id="form"
      v-model="data"
      type="form"
      :submit-attrs="{
      inputClass: 'p-button p-component',
    }"
      @submit="updateGeneralInformation"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
  </div>
</template>
