<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { buildProcessorSchema } from "@/components/ProcessSelector/utils";
import { useToast } from "primevue/usetoast";

const props = defineProps<{
  project: string | undefined;
  sandbox: string | undefined;
  track: number[] | undefined;
}>();

interface IPremise {
  state: string,
  message: string | null
}

interface IItem {
  type: string,
  description: string | null,
  value: string,
  selected: boolean,
  disabled: boolean
}

interface IEntry {
  type: string,
  label: string,
  argument: string,
  value: string | null,
  description: string,
  placeholder: string | null,
  disabled: boolean
}

interface ISelectEntry extends IEntry {
  items: IItem[]
  "multiple-options": boolean
}

interface IDecimalEntry extends IEntry {
  step: number | null,
  minimum: number | null,
  maximum: number | null,
  unit: string | null,
}

interface IProcessor {
  type: string,
  id: string,
  provider: string,
  language: string,
  name: string,
  version: number,
  description: string,
  categories: string[],
  steps: string[],
  icon: string | null,
  premise: IPremise,
  entries: IEntry[]
}

const nodes = ref([]);

const toast = useToast()

function structureData(data) {
  let categories = Object.groupBy(data, ({ type }) => type);
  for (const [key, value] of Object.entries(categories)) {
    const node = {
      key: key,
      data: {
        label: key,
        type: "category",
      },
      children: [],
    };
    for (const child of value) {
      node.children.push({
        key: child.id,
        data: {
          label: child.name,
          ...child,
        }
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
        processorDialogVisible.value = false
        emit("close")
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

const filters = ref({});

const emit = defineEmits(["close"]);
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
        @submit="runProcessor"
      >
        <FormKitSchema :schema="processorFormSchema" :data="formData" />
      </FormKit>
    </div>
  </Dialog>
  <TreeTable :value="nodes" :filters="filters">
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters['global']" placeholder="Global Search" />
        </IconField>
      </div>
    </template>
    <Column field="label" header="Label" expander style="min-width: 12rem">
      <template #filter>
        <InputText v-model="filters['name']" type="text" placeholder="Filter by label" />
      </template>
    </Column>
    <Column field="steps" header="Steps" style="min-width: 12rem">
      <template #filter>
        <InputText v-model="filters['size']" type="text" placeholder="Filter by step" />
      </template>
      <template #body="slotProps">
        <div class="flex flex-col space-y-2">
          <Tag v-for="step of slotProps.node.data.steps" :key="step" :value="step" />
        </div>
      </template>
    </Column>
    <Column field="description" header="Description" style="min-width: 12rem">
      <template #filter>
        <InputText v-model="filters['type']" type="text" placeholder="Filter by description" />
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <Button v-if="slotProps.node.data.type !== 'category'" @click="openProcessor(slotProps.node.data)">
          Select
        </Button>
      </template>
    </Column>
  </TreeTable>
</template>
