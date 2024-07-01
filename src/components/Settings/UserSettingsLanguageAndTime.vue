<script setup lang="ts">
import { languageAndTime } from "@/components/Settings/Schema/languageAndTime";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore()

const schema = languageAndTime
const data = ref(
  {
    language: uiStore.language
  }
)

function updateLanguageAndTime(values, { setErrors }) {

}
</script>
<template>
  <div
    class="flex h-full flex-1 flex-col rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900 space-y-4"
  >
    <h1 class="text-xl font-bold text-black dark:text-white">Language & Time</h1>
    <FormKit
      id="form"
      v-model="data"
      type="form"
      :submit-attrs="{
      inputClass: 'p-button p-component',
    }"
      @submit="updateLanguageAndTime"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
  </div>
</template>
