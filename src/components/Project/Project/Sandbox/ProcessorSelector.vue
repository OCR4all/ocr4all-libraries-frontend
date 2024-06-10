<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import Tree from "primevue/tree";

const nodes = ref([])

function structureData(data){
  let categories = Object.groupBy(data, ({ type }) => type);
  for(const [key, value] of Object.entries(categories)){
    const node = {
      "key": key,
      "label": key,
      "type": "category",
      "children": [

      ]
    }
    for(const child of value){
      node.children.push({
        key: child.id,
        label: child.name,
        ...child
      })
    }
    nodes.value.push(node)
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
const processorFormSchema = ref()
const formData = ref({})

function runProcessor(){
  console.log(formData)
}

function buildProcessorFormSchema(data){
  const schema = []
  for(const entry of data.entries){
    console.log(entry.value)
    const formType = (function () {
      switch(entry.type){
        case "decimal":
          return {
            type: "number",
            number: "float",
          }
        case "integer":
          return {
            type: "number",
            number: "integer"

          }
        case "select":
          return {
            type: "select",
          }
      }
    })
    schema.push({

    })
  }
  processorFormSchema.value = schema
}

function openProcessor(data){
  selectedProcessor.value = data
  buildProcessorFormSchema(data)
  processorDialogVisible.value = true
}

const processorDialogVisible = ref(false);

const value = ref('Off');
const options = ref(['Off', 'On']);
import SelectButton from "primevue/selectbutton";
</script>
<template>
  <div class="card flex justify-center">
    <SelectButton v-model="value" :options="options" aria-labelledby="basic" />
  </div>
  <Dialog v-model:visible="processorDialogVisible" modal header="Run Processor">
    <div class="flex space-x-2">
      <h1 class="text-xl text-surface-900 dark:text-surface-0 font-semibold"> {{ selectedProcessor.name }} </h1>
      <Tag v-for="category of selectedProcessor.categories" value="Primary" :key="category" :value="category"></Tag>
    </div>
    <h3 class="text-md text-surface-900 dark:text-surface-0"> {{ selectedProcessor.description }} </h3>
    <div>
    <FormKit v-model="formData" type="form" :actions="false">
      <FormKitSchema :schema="processorFormSchema"  />
    </FormKit>
    </div>
  </Dialog>
  <div class="flex flex-wrap gap-2 mb-4">
    <Button v-ripple label="Submit" />
    <Button type="button" icon="pi pi-plus" label="Expand All" @click="expandAll" />
    <Button type="button" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
  </div>
  <Tree :value="nodes" v-model:expandedKeys="expandedKeys" :filter="true" filterMode="lenient" class="w-full">
    <template #category="slotProps">
      <button @click="toggleNode(slotProps.node)">{{ slotProps.node.label }}</button>
    </template>
    <template #default="slotProps">
      <button @click="openProcessor(slotProps.node)">{{ slotProps.node.label }}</button>
    </template>
  </Tree>
</template>
