<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import Tree from "primevue/tree";

import { buildProcessorSchema } from "@/components/ProcessSelector/utils";
import { useToast } from "primevue/usetoast";

const props = defineProps<{
  project: string;
  sandbox: string;
  track: number[];
}>();

const nodes = ref([]);

const toast = useToast()

function structureData(data) {
  let categories = Object.groupBy(data, ({ type }) => type);
  for (const [key, value] of Object.entries(categories)) {
    const node = {
      key: key,
      label: key,
      type: "category",
      children: [],
    };
    for (const child of value) {
      node.children.push({
        key: child.id,
        label: child.name,
        ...child,
      });
    }
    nodes.value.push(node);
  }
}

useCustomFetch("/spi/list/workflow")
  .get()
  .json()
  .then((data) => structureData(data.data.value));

const expandedKeys = ref({});
const expandAll = () => {
  for (let node of nodes.value) {
    expandNode(node);
  }

  expandedKeys.value = { ...expandedKeys.value };
};

const collapseAll = () => {
  expandedKeys.value = {};
};

const expandNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true;

    for (let child of node.children) {
      expandNode(child);
    }
  }
};

const collapseNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = false;

    for (let child of node.children) {
      collapseNode(child);
    }
  }
};

const toggleNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = !expandedKeys.value[node.key];

    for (let child of node.children) {
      toggleNode(child);
    }
  }
};

const selectedProcessor = ref();
const processorFormSchema = ref();
const formData = ref();

function runProcessor(values, { setErrors }) {
  const url = `/spi/${selectedProcessor.value.type}/schedule/${props.project}/${props.sandbox}`;

  const registry = {}
  for(const entry of selectedProcessor.value.entries){
    registry[entry.label] = entry.type
  }

  console.log(selectedProcessor.value.entries)

  const booleans = [];
  const decimals = [];
  const integers = [];
  const selects = [];
  const strings = [];

  for(const [key, value] of Object.entries(values)){
    const processorType = registry[key]
    if(value){
      switch (processorType) {
        case "boolean":
          booleans.push({
            argument: key,
            value: value,
          });
          break;
        case "decimal":
          decimals.push({
            argument: key,
            value: value,
          });
          break;
        case "integer":
          integers.push({
            argument: key,
            value: value,
          });
          break;
        case "select":
          selects.push({
            argument: key,
            values: [value],
          });
          break;
        case "string":
          strings.push({
            argument: key,
            value: value,
          });
          break;
      }
    }
  }

  const payload = {
    id: selectedProcessor.value.id,
    label: selectedProcessor.value.label,
    description: `Run ${selectedProcessor.value.label} on ${props.sandbox}`,
    "job-short-description": `Run ${selectedProcessor.value.label} on ${props.sandbox}`,
    "parent-snapshot": {
      track: props.track,
    },
    ...(booleans.length !== 0 && { booleans: booleans }),
    ...(decimals.length !== 0 && { decimals: decimals }),
    ...(integers.length !== 0 && { integers: integers }),
    ...(selects.length !== 0 && { selects: selects }),
    ...(strings.length !== 0 && { strings: strings }),
  };

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
        })
      }else{
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Processor scheduled",
          life: 3000,
        })
      }
    })
}

function buildProcessorFormSchema(data) {
  const schema = buildProcessorSchema(data);
  processorFormSchema.value = schema;
}

function openProcessor(data) {
  selectedProcessor.value = data;
  buildProcessorFormSchema(data);
  processorDialogVisible.value = true;
}

const processorDialogVisible = ref(false);
</script>
<template>
  <Toast />
  <Dialog v-model:visible="processorDialogVisible" modal header="Run Processor">
    <div class="pb-6">
      <div class="flex space-x-2">
        <h1 class="text-xl font-semibold text-surface-900 dark:text-surface-0">
          {{ selectedProcessor.name }}
        </h1>
        <Tag
          v-for="category of selectedProcessor.categories"
          :key="category"
          :value="category"
        ></Tag>
      </div>
      <h3 class="text-md text-surface-900 dark:text-surface-0">
        {{ selectedProcessor.description }}
      </h3>
    </div>
    <div>
      <FormKit
        id="processorForm"
        ref="processorForm"
        v-model="formData"
        type="form"
        :submit-attrs="{
          inputClass: 'p-button p-component',
        }"
        @submit="runProcessor"
      >
        <FormKitSchema :schema="processorFormSchema" :data="formData" />
      </FormKit>
    </div>
  </Dialog>
  <div class="mb-4 flex flex-wrap gap-2">
    <Button
      type="button"
      icon="pi pi-plus"
      label="Expand All"
      @click="expandAll"
    />
    <Button
      type="button"
      icon="pi pi-minus"
      label="Collapse All"
      @click="collapseAll"
    />
  </div>
  <Tree
    v-model:expandedKeys="expandedKeys"
    :value="nodes"
    :filter="true"
    filter-mode="lenient"
    class="w-full"
  >
    <template #category="slotProps">
      <button @click="toggleNode(slotProps.node)">
        {{ slotProps.node.label }}
      </button>
    </template>
    <template #default="slotProps">
      <button @click="openProcessor(slotProps.node)">
        {{ slotProps.node.label }}
      </button>
    </template>
  </Tree>
</template>
