<script setup lang="ts">
import {Ref} from "vue";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";

const toast = useToast()

const dialogRef = inject("dialogRef");

const project: Ref<string | undefined> = ref();
const sandbox: Ref<string | undefined> = ref();
const track: Ref<number[] | undefined> = ref();

const processorSelector = ref()

onMounted(() => {
  project.value = dialogRef.value.data.project;
  sandbox.value = dialogRef.value.data.sandbox;
  track.value = dialogRef.value.data.track;
});

async function run(){
  const data = processorSelector.value.get()

  const url = `/spi/${data.processor.type}/schedule/${project.value}/${sandbox.value}`;

  const payload = {
    id: data.processor.id,
    label: data.processor.label,
    descriptiyon: `Run ${data.processor.label} on ${sandbox.value}`,
    "job-short-description": `Run ${data.processor.label} on ${sandbox.value}`,
    "parent-snapshot": {
      track: track.value,
    },
    ...data.parameters
  }

  useCustomFetch(url)
    .post(payload)
    .json()
    .then((response) => {
      if(response.error.value){
        toast.add({
          severity: "error",
          summary: "Error",
          detail: response.error.value,
          life: 3000,
          group: "general",
        })
      }else{
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Processor scheduled",
          life: 3000,
          group: "general",
        })
        processorSelector.value.processorDialogVisible = false
        dialogRef.value.close()
      }
    })

}
</script>
<template>
  <ProcessorSelector ref="processorSelector" @submit="run" />
</template>
