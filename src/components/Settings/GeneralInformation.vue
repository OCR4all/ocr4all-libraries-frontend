<script setup lang="ts">
import { generalInformation } from "@/components/Settings/Schema/generalInformation";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";

const schema = generalInformation;
const data = ref();

const toast = useToast();

await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    data.value = response.data.value;
  });

async function updateGeneralInformation(values, { setErrors }) {
  const payload = {
    login: data.value.login,
    email: data.value.email,
    name: data.value.name,
  };
  useCustomFetch(`/administration/security/user/update`)
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "General information updated",
          life: 3000,
          group: "general",
        });
      }
    });
}
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col space-y-4 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">
      General Information
    </h1>
    <FormKit
      id="form"
      v-model="data"
      type="form"
      submit-label="Save all"
      :submit-attrs="{
        inputClass: 'formkit-submit-btn',
      }"
      @submit="updateGeneralInformation"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
  </div>
</template>
