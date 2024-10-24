<script setup lang="ts">
import { EditorComponent, useBaklava } from "baklavajs";
import "@/assets/css/nodeflow-theme.css";

import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import InlineMessage from "primevue/inlinemessage";
import InputText from "primevue/inputtext";
import { IWorkflow } from "@/types/workflow.types";

import CToolbar from "@/components/NodeFlow/Custom/CToolbar.vue";
import CPalette from "@/components/NodeFlow/Custom/CPalette.vue";

const exportDialog = defineAsyncComponent(
  () => import("@/components/NodeFlow/Dialog/ExportDialog.vue"),
);

import {
  checkWorkflowExportability,
  saveWorkflowToBackend
} from "@/components/NodeFlow/logic/WorkflowExporter";
import { importNodesFromAPI } from "@/components/NodeFlow/logic/NodeFactory";
import { addNodeWithCoordinates } from "@/components/NodeFlow/logic/EditorFunctions";

import InputNode from "@/nodes/InputNode";

import { useNodeFlowStore } from "@/stores/nodeflow.store";
import { useCustomFetch } from "@/composables/useCustomFetch";

import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui.store";
import IconLoad from "~icons/uis/upload-alt";
import { useDialog } from "primevue/usedialog";

const { t } = useI18n();

const toast = useToast();

const uiStore = useUiStore();

const baklava = useBaklava();
baklava.settings.enableMinimap = true;
baklava.settings.palette.enabled = false;
baklava.settings.sidebar.resizable = true;
baklava.settings.nodes.resizable = true;
baklava.settings.contextMenu.enabled = false;

const editor = baklava.editor;
const palette = ref();

const store = useNodeFlowStore();

const nodeParameters = ref();
const isLoadingSaveWorkflow = ref(false);

editor.registerNodeType(InputNode);

Promise.resolve(importNodesFromAPI()).then(async (nodes) => {
  for (const node of nodes[0]) {
    editor.registerNodeType(node.node, { category: node.category });
  }
  nodeParameters.value = nodes[1];
  if (store.workflow) {
    selectedWorkflow.value = {
      id: store.workflow.id,
      label: store.workflow.label,
    };
    await loadWorkflow(store.workflow).then(() => {
      store.workflow = null;
    });
  } else {
    addNodeWithCoordinates(baklava, InputNode, 50, 350);
  }
});

const dialog = useDialog();

const selectedWorkflow = ref();
const availableWorkflows = ref();

const labelEntered = ref(true);

const isLoadDialogVisible = ref(false);
const isSaveDialogVisible = ref(false);

const workflowId = ref();
const workflowName = ref();
const originalWorkflowName = ref();
const workflowDescription = ref();

async function openLoadDialog() {
  const { error, data } = await useCustomFetch(`/workflow/list`).get().json();
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Couldn't retrieve workflows.",
      life: 3000,
      group: "general",
    });
  } else {
    const workflows = [];
    for (const workflow of data.value) {
      workflows.push({ label: workflow.label, id: workflow.id });
    }
    availableWorkflows.value = workflows;
    isLoadDialogVisible.value = true;
  }
}

function newGraph() {
  while (editor.graph.nodes.length > 0) {
    for (const node of editor.graph.nodes) {
      editor.graph.removeNode(node);
    }
  }
  addNodeWithCoordinates(baklava, InputNode, 50, 350);

  workflowId.value = null;
  workflowName.value = null;
  originalWorkflowName.value = null;
  workflowDescription.value = null;

  uiStore.breadcrumb = [
    {
      label: "Workflows",
      to: "/repository/overview?category=Workflows",
    },
    {
      label: "NodeFlow",
    },
  ];
}

async function openSaveDialog() {
  isSaveDialogVisible.value = true;
}

async function saveWorkflow() {
  if (!workflowName.value) {
    labelEntered.value = false;
  } else {
    isLoadingSaveWorkflow.value = true;
    const workflowListData = await useCustomFetch('/workflow/list',
    )
      .get()
      .json();
    if (
      workflowListData.data.value.filter(
        (entry) => entry.label === workflowName.value,
      ).length > 0 &&
      originalWorkflowName.value !== workflowName.value
    ) {
    } else {
      const { isFetching, error, data } = await useCustomFetch(
        '/spi/list',
      )
        .get()
        .json();
      const graph = editor.save();
      const workflow = saveWorkflowToBackend(graph, nodeParameters);
      const payload = {
        description: workflowDescription.value,
        label: workflowName.value,
        "view-model": JSON.stringify(graph),
        workflow: workflow,
      };
      if (
        workflowId.value &&
        workflowName.value === originalWorkflowName.value
      ) {
        await useCustomFetch(`/workflow/push/${workflowId.value}`)
          .post(payload)
          .json();
      } else {
        await useCustomFetch(`/workflow/push`).post(payload).json();
      }
      toast.add({
        severity: "success",
        summary: t("pages.nodeflow.toasts.save.success.summary"),
        detail: t("pages.nodeflow.toasts.save.success.detail"),
        life: 3000,
        group: "general",
      });
      isLoadingSaveWorkflow.value = false;
      isSaveDialogVisible.value = false;
    }
  }
}

async function loadWorkflow(workflow: IWorkflow) {
  const { isFetching, error, data } = await useCustomFetch(
    `/workflow/pull/${workflow.id}`,
  )
    .get()
    .json();
  try {
    editor.load(JSON.parse(data.value.view.model));
    workflowId.value = data.value.metadata.id;
    workflowDescription.value = data.value.metadata.description;
    workflowName.value = data.value.metadata.label;
    originalWorkflowName.value = data.value.metadata.label;

    uiStore.breadcrumb = [
      {
        label: "Workflows",
        to: "/repository/overview?category=Workflows",
      },
      {
        label: "NodeFlow",
      },
      {
        label: workflowName.value,
      },
    ];
    toast.add({
      severity: "success",
      summary: t("pages.nodeflow.toasts.load.success.summary"),
      detail: t("pages.nodeflow.toasts.load.success.detail"),
      life: 3000,
      group: "general",
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: t("pages.nodeflow.toasts.load.error.summary"),
      detail: t("pages.nodeflow.toasts.load.error.summary"),
      life: 3000,
      group: "general",
    });
    selectedWorkflow.value = undefined;
  }
  isLoadDialogVisible.value = false;
}

function exportWorkflow() {
  const graph = editor.save()
  const exportability = checkWorkflowExportability(graph)
  switch(exportability){
    case "no-input-node":
      toast.add({
        severity: "info",
        summary: "Info",
        detail: "Only valid workflows can be exported. Please add an Input node.",
        life: 3000,
        group: "general"
      })
      break;
    case "non-ocrd-node":
      toast.add({
        severity: "info",
        summary: "Info",
        detail: "OCR-D workflow export is only possible for workflows exclusively using OCR-D processors.",
        life: 3000,
        group: "general"
      })
      break;
    case "yes":
      dialog.open(exportDialog, {
        props: {
          header: "Export OCR-D workflow",
          modal: true,
          style: {
            width: "25vw",
          },
          breakpoints: {
            "960px": "80vw",
            "640px": "85vw",
          },
        },
        data: {
          graph: graph,
          params: nodeParameters,
          name: originalWorkflowName
        },
        onClose: () => {
        },
      });
      return
  }
}

function rateWorkflow() {
  toast.add({
    severity: "info",
    summary: t("pages.nodeflow.toasts.rate-workflow.placeholder.summary"),
    detail: t("pages.nodeflow.toasts.rate-workflow.placeholder.detail"),
    life: 3000,
    group: "general",
  });
}

function zoomIn() {
  baklava.displayedGraph.scaling += 0.1;
}

function zoomOut() {
  baklava.displayedGraph.scaling -= 0.1;
}

function togglePalette() {
  palette.value.toggleVisibility();
}

const editorEl = ref();

const { isFullscreen, toggle } = useFullscreen(editorEl);

provide("fullscreen", isFullscreen);
</script>

<template>
  <Dialog
    v-model:visible="isLoadDialogVisible"
    modal
    header="Load Workflow"
    :style="{ width: '95vw' }"
  >
    <div class="space-y-5">
      <WorkflowChooser label="Load" :icon="IconLoad" @submit="loadWorkflow" />
    </div>
  </Dialog>
  <Dialog
    v-model:visible="isSaveDialogVisible"
    modal
    header="Save Workflow"
    :style="{ width: '50vw' }"
  >
    <div class="space-y-5">
      <div class="mx-auto grid grid-cols-6 gap-4">
        <div class="col-span-6 flex flex-col space-y-2">
          <label
            for="text"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
            >Name*</label
          >
          <InputText v-model="workflowName" type="text" />
          <InlineMessage v-show="!labelEntered"
            >A workflow name is required</InlineMessage
          >
        </div>

        <div class="col-span-6 flex flex-col">
          <label
            for="last-name"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
            >Description</label
          >
          <InputText v-model="workflowDescription" type="text" />
        </div>
      </div>
      <button
        v-if="!isLoadingSaveWorkflow"
        type="button"
        class="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="saveWorkflow"
      >
        Save
      </button>
      <button
        v-if="isLoadingSaveWorkflow"
        type="button"
        class="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click="saveWorkflow"
      >
        <svg
          aria-hidden="true"
          role="status"
          class="mr-3 inline h-4 w-4 animate-spin text-white"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Saving...
      </button>
    </div>
  </Dialog>
  <EditorComponent id="editor" ref="editorEl" :view-model="baklava">
    <template #toolbar>
      <CToolbar
        @new="newGraph"
        @load="openLoadDialog"
        @save="openSaveDialog"
        @export="exportWorkflow"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @rate-workflow="rateWorkflow"
        @toggle-palette="togglePalette"
        @toggle-fullscreen="toggle"
      />
    </template>
    <template #node="nodeProps">
      <CNode :key="nodeProps.node.id" v-bind="nodeProps" />
    </template>
    <template #sidebar>
      <CSidebar />
    </template>
    <template #palette>
      <CPalette ref="palette" />
    </template>
  </EditorComponent>
</template>
