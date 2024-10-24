<script setup lang="ts">
import { computed, CSSProperties, inject, Ref, ref, reactive } from "vue";
import { usePointer } from "@vueuse/core";
import { AbstractNode, INodeTypeInformation } from "baklavajs";
import PaletteEntry from "./CPaletteEntry.vue";
import { useViewModel, useTransform } from "baklavajs";

import Tree from "primevue/tree";

type NodeTypeInformations = Record<string, INodeTypeInformation>;

const visible = ref(true);

function toggleVisibility() {
  visible.value = !visible.value;
}

defineExpose({
  toggleVisibility,
});

const expandedKeys = ref({});

const toggleNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = !expandedKeys.value[node.key];

    for (let child of node.children) {
      toggleNode(child);
    }
  }
};

interface IDraggedNode {
  type: string;
  nodeInformation: INodeTypeInformation;
}
const { viewModel } = useViewModel();
const { x: mouseX, y: mouseY } = usePointer();
const { transform } = useTransform();

const editorEl = inject<Ref<HTMLElement | null>>("editorEl");

const draggedNode = ref<IDraggedNode | null>(null);

const categories = computed<
  Array<{ name: string; nodeTypes: NodeTypeInformations }>
>(() => {
  const nodeTypeEntries: any[] = [];
  const categoryNames: Set<string> = new Set();
  for (const [key, value] of viewModel.value.editor.nodeTypes.entries()) {
    nodeTypeEntries.push({
      key: key,
      label: value.title,
      category: value.category,
      type: "node",
      nt: value.type,
      ni: value,
    });
    categoryNames.add(value.category);
  }

  const categories: Array<{ name: string; nodeTypes: NodeTypeInformations }> =
    [];
  for (const category of categoryNames.values()) {
    const nodeTypesInCategory = [];
    if (category !== "Subgraphs") {
      for (const node of nodeTypeEntries) {
        if (node.category === category) {
          nodeTypesInCategory.push(node);
        }
      }

      if (nodeTypesInCategory.length > 0) {
        if (category !== "default") {
          categories.push({
            key: category,
            label: category,
            children: nodeTypesInCategory,
          });
        }
      }
    }
    // Hardcode sort order of categories, this should be handled differently in the future (get sort order from backend?)
    const sortOrder = ["Preprocessing", "Layout Analysis", "Text Recognition"];
    categories.sort((x, y) => {
      return sortOrder.indexOf(x as string) - sortOrder.indexOf(y as string);
    });

    //// Disabled as the sort order currently has to be hard coded to follow the most sensible flow of an OCR workflow
    //// Order might have to be moved to the backend
    // sort, so the default category is always first and all others are sorted alphabetically
    // categories.sort((a, b) => {
    //   if (a.name === "default") {
    //     return -1;
    //   } else if (b.name === "default") {
    //     return 1;
    //   } else {
    //     return a.name > b.name ? 1 : -1;
    //   }
    // });
  }
  return categories;
});

const draggedNodeStyles = computed<CSSProperties>(() => {
  if (!draggedNode.value || !editorEl?.value) {
    return {};
  }
  if ("getBoundingClientRect" in editorEl.value) {
    const { left, top } = editorEl.value.getBoundingClientRect();

    return {
      top: `${mouseY.value - top}px`,
      left: `${mouseX.value - left}px`,
    };
  }
});

const onDragStart = (type: string, nodeInformation: INodeTypeInformation) => {
  draggedNode.value = {
    type,
    nodeInformation,
  };

  const onDragEnd = () => {
    const instance = reactive(new nodeInformation.type()) as AbstractNode;
    viewModel.value.displayedGraph.addNode(instance);

    const rect = editorEl?.value?.getBoundingClientRect();
    const [x, y] = transform(mouseX.value - rect.left, mouseY.value - rect.top);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    instance.position.x = x;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    instance.position.y = y;

    console.log(x, y);

    draggedNode.value = null;
    document.removeEventListener("pointerup", onDragEnd);
  };
  document.addEventListener("pointerup", onDragEnd);
};

import { useMouseInElement } from "@vueuse/core";
const palette = ref();

const { x, y, isOutside } = useMouseInElement(palette);
</script>

<template>
  <div v-show="visible" ref="palette" class="overflow-scroll-y h-full">
    <div
      class="baklava-node-palette !m-5 !w-[20rem] !rounded-xl !border !border-surface-200 !bg-surface-0 dark:!border-surface-700 dark:!bg-surface-900"
    >
      <h1
        class="pb-5 text-center text-xl font-bold text-surface-800 dark:text-surface-100"
      >
        {{ $t("pages.nodeflow.palette.processors") }}
      </h1>
      <Tree
        :value="categories"
        v-model:expandedKeys="expandedKeys"
        :filter="true"
        filterMode="lenient"
        class="w-full"
      >
        <template #default="slotProps">
          <div class="cursor-pointer flex justify-between" @click="toggleNode(slotProps.node)">
            <p>{{ slotProps.node.key }}</p>
            <Badge :value="slotProps.node.children.length" severity="secondary" />
          </div>
        </template>
        <template #node="slotProps">
          <PaletteEntry
            :key="slotProps.node.key"
            :type="slotProps.node.nt"
            :title="slotProps.node.label"
            @pointerdown="onDragStart(slotProps.node.label, slotProps.node.ni)"
          />
        </template>
      </Tree>
    </div>
    <transition name="fade">
      <div
        v-if="draggedNode"
        class="baklava-dragged-node"
        :style="draggedNodeStyles"
      >
        <PaletteEntry
          :type="draggedNode.type"
          :title="draggedNode.nodeInformation.title"
        />
      </div>
    </transition>
  </div>
</template>
<style scoped>
:deep(.p-tree-node-label) {
  width: 100%;
}
</style>
