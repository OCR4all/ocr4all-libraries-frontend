<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const dialogRef = inject("dialogRef");
const logs: Ref<string> = ref("");
const filteredLogs: Ref<string[]> = ref([]);

const toast = useToast();

const { text, copy, copied, isSupported } = useClipboard({ logs });

onMounted(() => {
  logs.value = dialogRef.value.data.text;
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
        results.push(line);
      }
    }
    filteredLogs.value = results;
  }
});

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

    <template #end>
      <Button
        icon="pi pi-clipboard"
        class="mr-2"
        severity="contrast"
        text
        @click="copyToClipboard"
      />
      <Button
        icon="pi pi-download"
        class="mr-2"
        severity="contrast"
        text
        @click="download"
      />
    </template>
  </Toolbar>
  <div
    class="max-h-full w-[90vw] overflow-auto rounded bg-black p-8 text-white md:w-[80vw]"
  >
    <div class="grid">
      <div
        v-for="(log, index) in filteredLogs"
        :key="index"
        class="max-w-[80vw]"
      >
        <pre>{{ log }}</pre>
      </div>
    </div>
  </div>
</template>
