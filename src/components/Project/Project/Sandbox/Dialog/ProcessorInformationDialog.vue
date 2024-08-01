<script setup lang="ts">
const dialogRef = inject("dialogRef");

const data = ref({})
const processors = ref({})

onMounted(() => {
  data.value = dialogRef.value.data.information;
  processors.value = dialogRef.value.data.processors;
  console.log(data.value)
});
</script>
<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>General</AccordionHeader>
      <AccordionContent>
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
              class="whitespace-nowrap px-6 py-4 font-medium text-surface-900 dark:text-white"
            >
              {{ value[0] }}
            </th>
            <td class="px-6 py-4 dark:text-white">
              <pre v-if="['instance', 'service-provider'].includes(value[0])">{{ value[1] }}</pre>
              <span v-else>
                {{ value[1] }}
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="1">
      <AccordionHeader>Parameters</AccordionHeader>
      <AccordionContent>
        <table
          v-show="processors !== undefined"
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
            v-for="(value, key) in Object.entries(processors)"
            :key="key"
            class="border-b bg-white dark:border-surface-800 dark:bg-surface-900"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-surface-900 dark:text-white"
            >
              {{ value[0] }}
            </th>
            <td class="px-6 py-4 dark:text-white">
              {{ value[1] }}
            </td>
          </tr>
          </tbody>
        </table>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
