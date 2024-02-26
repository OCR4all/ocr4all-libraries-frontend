<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { GRAPH_NODE_TYPE_PREFIX } from "@baklavajs/core";

import { useViewModel } from "baklavajs";

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { viewModel } = useViewModel();

    const showContextMenu = ref(false);
    const hasContextMenu = computed(() =>
      props.type.startsWith(GRAPH_NODE_TYPE_PREFIX),
    );

    const openContextMenu = () => {
      showContextMenu.value = true;
    };

    const onContextMenuClick = (action: string) => {
      const graphTemplateId = props.type.substring(
        GRAPH_NODE_TYPE_PREFIX.length,
      );
      const graphTemplate = viewModel.value.editor.graphTemplates.find(
        (gt) => gt.id === graphTemplateId,
      );
      if (!graphTemplate) {
        return;
      }
    };

    const favorites = [
      "ocrd-cis-ocropy-binarize",
      "ocrd-tesserocr-binarize",
      "ocrd-tesserocr-segment",
      "ocrd-calamari-recognize",
      "ocrd-tesserocr-recognize"
    ]

    return {
      showContextMenu,
      hasContextMenu,
      openContextMenu,
      onContextMenuClick,
      favorites
    };
  },
});
</script>

<template>
  <div class="baklava-node --palette" :data-node-type="type">
    <div class="__title">
      <div class="__title-label">
        {{ title }} {{ favorites.includes(title) ? "⭐" : "" }}
      </div>
    </div>
  </div>
</template>
