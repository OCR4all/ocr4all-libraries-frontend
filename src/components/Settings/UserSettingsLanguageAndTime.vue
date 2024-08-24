<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { languageAndTime } from "@/components/Settings/Schema/languageAndTime";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const toast = useToast();

const schema = languageAndTime;
const data = ref({
  language: i18n.locale.value,
});

function updateLanguageAndTime(values, { setErrors }) {
  try {
    localStorage.setItem("ocr4all/frontend/language", values.language);
    i18n.locale.value = values.language;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Language and Time updated",
      life: 3000,
      group: "general",
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
      group: "general",
    });
  }
}
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col space-y-4 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">
      Language & Time
    </h1>
    <FormKit
      id="form"
      v-model="data"
      type="form"
      submit-label="Save all"
      :submit-attrs="{
        inputClass: '',
      }"
      @submit="updateLanguageAndTime"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
  </div>
</template>
