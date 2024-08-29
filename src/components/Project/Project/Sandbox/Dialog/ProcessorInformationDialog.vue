<script setup lang="ts">
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const data = ref({});

onMounted(() => {
  data.value = dialogRef?.value.data.information;
});
</script>
<template>
<table
  v-show="data !== undefined"
  class="w-full text-left text-sm text-surface-500 dark:text-surface-400"
>
  <thead
    class="bg-surface-50 text-xs uppercase text-surface-700 dark:bg-zinc-700 dark:text-white"
  >
    <tr>
      <th scope="col" class="px-6 py-3">Parameter</th>
      <th scope="col" class="px-6 py-3">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="(value, key) in Object.entries(data)"
      :key="key"
      class="border-b bg-white dark:border-surface-800 dark:bg-surface-900"
    >
      <th
        scope="row"
        class="whitespace-nowrap px-6 py-4 font-semibold text-surface-900 dark:text-white"
      >
        {{ value[0] }}
      </th>
      <td class="px-6 py-4 text-surface-800 dark:text-white">
        <pre
          v-if="['instance', 'service-provider'].includes(value[0])"
          >{{ value[1] }}</pre
        >
        <span v-else>
          {{ value[1] }}
        </span>
      </td>
    </tr>
  </tbody>
</table>
</template>
