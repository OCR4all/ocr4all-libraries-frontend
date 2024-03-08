<script lang="ts">
import { defineComponent } from "vue";
import { NodeInterface } from "baklavajs";
import { useNodeFlowStore } from "@/stores/nodeflow.store";

export default defineComponent({
  props: {
    intf: {
      type: Object as () => NodeInterface,
      required: true,
    },
  },
  emits: ["openSidebar"],
  setup(props, { emit }) {
    const store = useNodeFlowStore();
    const onClick = () => {
      store.sidebarDescriptions = props.intf.value;
      emit("openSidebar");
    };

    return { onClick };
  },
});
</script>
<template>
  <button class="baklava-button --block" :title="intf.name" @click="onClick">
    {{ intf.name }}
  </button>
</template>
