<script setup lang="ts">
import { useGraph } from "baklavajs";
import { useNodeFlowStore } from "@/stores/nodeflow.store";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const { graph } = useGraph();

const store = useNodeFlowStore();

const el = ref<HTMLElement | null>(null);
const width = ref(500);

const node = computed(() => {
  const id = graph.value["sidebar"].nodeId;
  return graph.value.nodes.find((x) => x.id === id);
});

const styles = computed(() => ({
  width: `${width.value}px`,
}));

const close = () => {
  graph.value["sidebar"].visible = false;
};

const startResize = () => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener(
    "mouseup",
    () => {
      window.removeEventListener("mousemove", onMouseMove);
    },
    { once: true },
  );
};

const onMouseMove = (event: MouseEvent) => {
  const maxwidth =
    el.value?.parentElement?.getBoundingClientRect().width ?? 500;
  width.value -= event.movementX;
  if (width.value < 300) {
    width.value = 300;
  } else if (width.value > 0.9 * maxwidth) {
    width.value = 0.9 * maxwidth;
  }
};
</script>
<template>
  <div
    ref="el"
    class="baklava-sidebar"
    :class="{ '--open': graph['sidebar'].visible }"
    :style="styles"
  >
    <div class="__resizer" @mousedown="startResize" />
    <div class="__header flex justify-start">
      <button tabindex="-1" class="__close" @click="close">&times;</button>
    </div>
    <div v-if="store.sidebarDescriptions !== undefined">
      <h2
        class="my-5 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        {{ $t("pages.nodeflow.sidebar.description") }}
      </h2>
      <p class="text-center text-lg text-black dark:text-surface-200">
        {{ store.sidebarDescriptions["processor"] }}
      </p>
      <div v-show="store.sidebarDescriptions.parameters.length > 0">
        <h3
          class="my-5 text-center text-lg font-bold text-black dark:text-white sm:text-xl md:text-2xl"
        >
          {{ $t("pages.nodeflow.sidebar.parameters") }}
        </h3>
        <div class="flex flex-col space-y-2">
          <Accordion
            multiple
            expandIcon="pi pi-plus"
            collapseIcon="pi pi-minus"
          >
            <AccordionPanel
              v-for="parameter in store.sidebarDescriptions.parameters"
              :key="parameter.title"
              :value="parameter.title"
            >
              <AccordionHeader>{{ parameter.title }}</AccordionHeader>
              <AccordionContent>
                <p class="p-4">{{ parameter.description }}</p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.baklava-sidebar {
  @apply !bg-surface-50 text-black dark:!bg-zinc-800 dark:!text-white;
}
</style>
