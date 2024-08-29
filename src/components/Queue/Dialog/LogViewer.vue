<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");
const logs: Ref<string> = ref("");
const filteredLogs: Ref<string[]> = ref([]);

import sanitizeHtml from 'sanitize-html';
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const toast = useToast();

const { text, copy, copied, isSupported } = useClipboard({ logs });

onMounted(() => {
  logs.value = dialogRef?.value.data.text;
  filteredLogs.value = logs.value.split("\n");
});

const search = ref();

watch(search, (newSearch, _) => {
  const original = logs.value.split("\n");
  if (!newSearch) {
    filteredLogs.value = original;
  } else {
    const results = [];
    for (const line of original) {
      if (line.toLowerCase().includes(newSearch.toLowerCase())) {
        results.push(sanitizeHtml(highlightWords(line, newSearch), {
          allowedClasses: {
            "span": ["bg-yellow-500/50", "p-1", "text-white", "rounded-sm"]
          }
        }));
      }
    }
    filteredLogs.value = results;
  }
});

function highlightWords(input: string, search: string): string {
  return input.replaceAll(search, `<span class="bg-yellow-500/50 p-1 text-white rounded-sm">${search}</span>`)
}

function copyToClipboard() {
  copy(logs.value);
  toast.add({
    severity: "info",
    summary: "Copied to Clipboard",
    life: 3000,
    group: "general",
  });
}

function download() {
  const url = window.URL.createObjectURL(new Blob([logs.value]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `log.txt`);
  document.body.appendChild(link);
  link.click();
}
</script>
<template>
  <Toolbar>
    <template #start>
      <Button
          text
          @click="copyToClipboard">
        <i class="pi pi-clipboard text-black dark:text-white" />
      </Button>
      <Button
          text
          @click="download"
      >
        <i class="pi pi-download text-black dark:text-white" />
      </Button>
    </template>

    <template #end>
      <div class="flex space-x-2">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="search" placeholder="Search" />
        </IconField>
        <p v-if="search" class="self-center">
          {{ filteredLogs.length }} results
        </p>
      </div>
    </template>
  </Toolbar>
  <div
    class="max-h-full overflow-auto rounded bg-black p-8 text-white"
  >
    <div class="grid">
      <div
        v-for="(log, index) in filteredLogs"
        :key="index"
        class="max-w-[80vw] mb-1"
      >
        <span v-html="log" />
      </div>
    </div>
  </div>
</template>
