<script setup lang="ts">
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
import { exportWorkflowToFile } from "@/components/NodeFlow/logic/WorkflowExporter";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const graph = ref()
const nodeParams = ref()
const name = ref()

const mode = ref('Docker');
const modeOptions = ref(['Docker', 'Native']);

onMounted(() => {
  graph.value = dialogRef?.value.data.graph;
  nodeParams.value = dialogRef?.value.data.params;
  name.value = dialogRef?.value.data.name;
});

function exportWorkflow(){
  const exportString = exportWorkflowToFile(graph.value, nodeParams.value, mode.value)
  const url = window.URL.createObjectURL(new Blob([exportString]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name.value}.txt`);
  document.body.appendChild(link);
  link.click();
  dialogRef?.value.close()
}
</script>
<template>
  <div class="grid grid-cols-1 gap-y-4">
    <div class="justify-self-center flex-col">
      <SelectButton v-model="mode" :options="modeOptions" :allowEmpty="false" aria-labelledby="basic" />
    </div>
    <Button
      severity="contrast"
      @click="exportWorkflow"
    >
      Export
    </Button>
  </div>
</template>
