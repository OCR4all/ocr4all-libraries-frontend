<script setup lang="ts">
import { passwordSchema } from "@/components/Settings/Schema/passwordSchema";
import { useCustomFetch } from "@/composables/useCustomFetch";

const schema = passwordSchema
const data  = ref()

function submitPasswordChange(values, { setErrors }) {
  const payload = {
    password: data.value.password,
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
    <h1 class="text-xl font-bold text-black dark:text-white">Password</h1>
    <FormKit
      id="passwordForm"
      ref="passwordForm"
      v-model="data"
      type="form"
      submit-label="Save all"
      @submit="submitPasswordChange"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
  </div>
</template>
