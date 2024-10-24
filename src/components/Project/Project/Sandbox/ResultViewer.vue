<script setup lang="ts">
import { useFindNestedObject } from "@/composables/useFindNestedObject";

import OrganizationChart from "primevue/organizationchart";
import Button from "primevue/button";
import Toast from "primevue/toast";

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import ProgressBar from "primevue/progressbar";
import { useUiStore } from "@/stores/ui.store";
import { useDialog } from "primevue/usedialog";
import { useAuthStore } from "@/stores/auth.store";

import IconUnlock from "~icons/fluent/lock-open-28-filled";
import IconStart from "~icons/fluent/play-circle-28-filled";
import IconAddToDataset from "~icons/fluent/stack-add-24-filled";
import IconExport from "~icons/fluent/arrow-download-20-filled";
import IconLarex from "~icons/fluent/notebook-eye-20-filled";
import IconInformation from "~icons/fluent/info-32-filled";

import {
  IEnrichedNode,
  INode,
} from "@/components/Project/Project/Sandbox/resultviewer.interface";

import { useConfigStore } from "@/stores/config.store";

const authStore = useAuthStore();
const configStore = useConfigStore();

const processorDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Sandbox/Dialog/ProcessorDialog.vue"),
);

const exportDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Project/Project/Sandbox/Dialog/ExportSnapshotDialog.vue"
    ),
);

const processorInformationDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Project/Project/Sandbox/Dialog/ProcessorInformationDialog.vue"
    ),
);
const addToDatasetDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Project/Project/Sandbox/Dialog/AddToDatasetDialog.vue"
    ),
);

const router = useRouter();
const project = router.currentRoute.value.params.project;
const sandbox = router.currentRoute.value.params.sandbox;

const toast = useToast();

const larexForm = ref();

const { t } = useI18n();

interface ITrack {
  [key: string]: boolean;
}

const LAREX_LAUNCHER_SPI =
  "de.uniwuerzburg.zpd.ocr4all.application.core.spi.postcorrection.provider.LAREXLauncher";

const isGeneratingSandbox = ref(false);

const selectedSnapshot: Ref<INode | undefined> = ref();
const selection: Ref<ITrack> = ref({});

const formFileMap = ref();
const formMimeMap = ref();

const selectedSnapshotInformation = ref();
const selectedSnapshotLock = ref();

const createdTrack = ref();

const nodes = ref();

const sandboxGenerationToastVisible = ref(false);

const LAREX_LABEL = "LAREX launcher default";

const dialog = useDialog();

function convertSelectionToTrack(selection: ITrack) {
  if (Object.keys(selection)[0].length == 0) return [];
  return Object.keys(selection)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });
}

function openProcessorDialog(snapshot: ITrack) {
  const key = convertSelectionToTrack(snapshot);

  dialog.open(processorDialog, {
    props: {
      header: "Run processor",
      modal: true,
      style: {
        width: "95vw",
      },
    },
    data: {
      project: project,
      sandbox: sandbox,
      track: key,
    },
    onClose: (data: unknown) => {
      if (data.data) {
        toast.add({
          severity: "info",
          summary: "Processor is running",
          detail: data.data,
          group: "job",
        });
      }
      refetch();
    },
  });
}

const showSandboxGenerationToast = () => {
  if (!sandboxGenerationToastVisible.value) {
    toast.add({
      severity: "custom",
      summary: "Collecting files for LAREX",
      group: "headless",
    });
    sandboxGenerationToastVisible.value = true;
  }
};

async function collectSnapshotInformation(data: INode) {
  const payload = {
    track: data.snapshot.track,
  };
  useCustomFetch(`/snapshot/entity/${project}/${sandbox}`)
    .post(payload)
    .json()
    .then((response) => {
      selectedSnapshotLock.value =
        response.data.value.configuration.lock != null;
      selectedSnapshotInformation.value = response.data.value.configuration;
    });
}

async function unlockSnapshot(track: ITrack) {
  const payload = {
    track: convertSelectionToTrack(track),
    source: "unlockSnapshot",
    description: `${authStore.user} unlocked the snapshot`,
  };
  useCustomFetch(`/snapshot/unlock/${project}/${sandbox}`)
    .post(payload)
    .json()
    .then((response) => {
      if (!response.error.value) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Snapshot unlocked",
          life: 3000,
          group: "general",
        });
        selectedSnapshotLock.value = false;
      }
    });
}

/* TODO: Locking Snapshots isn't supported by the backend yet.
    Remove or wait for backend implementation. */
async function lockSnapshot(track: ITrack) {
  const payload = {
    track: track,
    source: "unlockSnapshot",
    description: `${authStore.user} unlocked the snapshot`,
  };
  useCustomFetch(`/snapshot/lock/${project}/${sandbox}`)
    .post(payload)
    .json()
    .then((response) => {
      if (!response.error.value) {
        refetch();
      }
    });
}

function enrichData(node: INode) {
  const current = node as IEnrichedNode;
  current.label = node.snapshot.configuration.label;
  current.type = node.snapshot.configuration["type-label"];
  current.key = node.snapshot.track;
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => enrichData(child));
  }
}

async function refetch() {
  const { isFetching, error, data } = await useCustomFetch(
    `/sandbox/tree/${project}?id=${sandbox}`,
  )
    .get()
    .json();
  if(error.value || !data.value.snapshot) {
    refetchInterval.pause()
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Results couldn't be retrieved",
      life: 3000,
      group: "general",
    });
  }else{
    enrichData(data.value);
    nodes.value = data.value;
    console.log(nodes.value)
  }
}

const refetchInterval = useIntervalFn(() => {
  refetch()
}, 2000)

function getSnapshotFromSelection(selection: ITrack): IEnrichedNode {
  if (Object.keys(selection)[0].length == 0) return nodes.value;
  const key = convertSelectionToTrack(selection);
  return useFindNestedObject(nodes, "key", key);
}

async function generateSandbox(selection: ITrack) {
  const snapshotData = getSnapshotFromSelection(selection);
  if (snapshotData.label === LAREX_LABEL) {
    createdTrack.value = snapshotData.key;
  } else {
    isGeneratingSandbox.value = true;
    showSandboxGenerationToast();
    selectedSnapshot.value = snapshotData;
    const payload = {
      id: LAREX_LAUNCHER_SPI,
      "parent-snapshot": { track: snapshotData.key },
      label: "LAREX launcher default",
      description: "LAREX snapshot",
    };
    const { isFetching, error, data } = await useCustomFetch(
      `/spi/postcorrection/schedule/${project}/${sandbox}`,
    )
      .post(payload)
      .json();
    if (error.value) {
      toast.add({
        severity: "error",
        summary: t(
          "pages.projects.result-viewer.overview.toasts.schedule-result-view.error.summary",
        ),
        detail: t(
          "pages.projects.result-viewer.overview.toasts.schedule-result-view.error.summary",
        ),
        life: 3000,
        group: "general",
      });
    } else {
      const startedJob = data.value["job-id"];
      await checkJob(startedJob);
      const jobResponse = await useCustomFetch(`job/entity/${startedJob}`)
        .get()
        .json();
      createdTrack.value =
        jobResponse.data.value.journal.steps["0"]["snapshot-track"];
    }
  }

  const payload = {
    track: createdTrack.value,
  };

  useCustomFetch(`/snapshot/mets/file/${project}/${sandbox}`)
    .post(payload)
    .json()
    .then(async (response) => {
      const larexMaps = await createLarexMapsFromFiles(response.data.value);
      formFileMap.value = JSON.stringify(larexMaps.fileMap);
      formMimeMap.value = JSON.stringify(larexMaps.mimeMap);
      await nextTick();
      await larexForm.value.submit();

      toast.removeGroup("headless");
      refetch();
    });
}

function getTagClasses(type: string): string {
  switch (type) {
    case "Launcher":
      return "!bg-surface-200 !text-surface-900";
    case "Preprocessing":
      return "!bg-lime-100 dark:!bg-lime-200 !text-lime-900";
    case "Layout Analysis":
      return "!bg-orange-100 dark:!bg-orange-200 !text-orange-900";
    case "Text Recognition":
      return "!bg-blue-100 dark:!bg-blue-200 !text-blue-900";
    case "Format Conversion":
      return "!bg-violet-100 dark:!bg-violet-200 !text-violet-900";
    case "Postcorrection":
      return "!bg-green-100 dark:!bg-green-200 !text-green-900";
    default:
      return "";
  }
}

function hasLarexView(selection: ITrack): boolean {
  const snapshot = getSnapshotFromSelection(selection);
  return snapshot.children.map((entry) => entry.label).includes(LAREX_LABEL);
}

function isExportNode(selection: ITrack): boolean {
  const snapshot = getSnapshotFromSelection(selection);
  return snapshot.type === "Format Conversion"
}

function isCompleted(selection: ITrack): boolean {
  const snapshot = getSnapshotFromSelection(selection);
  return snapshot.snapshot.process.state === "completed"
}



function isLarexNode(selection: ITrack): boolean {
  const snapshot = getSnapshotFromSelection(selection);
  return snapshot.label === "LAREX launcher default"
}

function openProcessorInformationDialog(information: unknown) {
  dialog.open(processorInformationDialog, {
    props: {
      header: "Information",
      modal: true,
      style: {
        width: "75vw",
      },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
    },
    data: {
      information: selectedSnapshotInformation.value,
    },
  });
}

function openExportSnapshotDialog(snapshot: ITrack) {
  const key = Object.keys(snapshot)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });
  dialog.open(exportDialog, {
    props: {
      header: "Export snapshot",
      modal: true,
      style: {
        width: "25vw",
      },
      breakpoints: {
        "1500px": "30vw",
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    data: {
      project: project,
      sandbox: sandbox,
      track: key,
    },
    onClose: () => {
      refetch();
    },
  });
}

function openAddToDatasetDialog(snapshot: ITrack) {
  dialog.open(addToDatasetDialog, {
    props: {
      header: "Add to dataset",
      modal: true,
      style: {
        width: "75vw",
      },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
    },
    data: {
      key: convertSelectionToTrack(snapshot),
      project: project,
      sandbox: sandbox,
    },
    onClose: () => {
      refetch();
    },
  });
}

const scheduledJobs: Ref<number[]> = ref([]);
const runningJobs: Ref<number[]> = ref([]);
const finishedJobs: Ref<number[]> = ref([]);

const jobInterval = useIntervalFn(() => {
  useCustomFetch(`/job/overview/domain`)
    .get()
    .json()
    .then((response) => {
      console.log(response.data.value)
      const jobMap = response.data.value;
      const scheduled = [];
      for (const entry of jobMap["scheduled"]) {
        scheduled.push(entry.id);
      }
      scheduledJobs.value = scheduled;

      const running = [];
      for (const entry of jobMap["running"]) {
        running.push(entry.id);
      }
      runningJobs.value = running;

      const finished = [];
      for (const entry of jobMap["done"]) {
        finished.push(entry.id);
      }
      finishedJobs.value = finished;
    });
}, 1000);

onUnmounted(() => {
  jobInterval.pause()
  refetchInterval.pause()
})

async function checkJob(startedJob: number) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/overview/domain`,
      )
        .get()
        .json();
      for (const job of Object.values(data.value.done)) {
        if (job.id === startedJob && job.state == "completed") {
          clearInterval(jobInterval);
          isGeneratingSandbox.value = false;
          resolve(true);
        }
      }
    }, 5000);
  });
}
refetch();

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Projects",
    to: "/project/overview",
  },
  {
    label: project,
    to: `/project/${project}/view`,
  },
  {
    label: sandbox,
  },
];
useHead({
  title: sandbox,
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

const actionDock = ref({
  colorScheme: {
    light: {
      root: {
        borderColor: "{surface.200}",
        itemPadding: "0px",
      },
    },
    dark: {
      root: {
        borderColor: "{surface.600}",
        itemPadding: "0px",
      },
    },
  },
});

function getClassByState(state: string, animate: boolean): string {
  switch(state){
    case "completed":
      return "bg-green-500"
    case "running":
      return animate ? "bg-yellow-500 animate-ping" : "bg-yellow-500"
    case "interrupted":
      return "bg-red-500"

  }
}

async function createLarexMapsFromFiles(sets: string[]): unknown {
  const fileMap = {};
  const mimeMap = {};

  const environment = await useCustomFetch(`/instance/environment`)
    .get()
    .json();
  const basePath = environment.data.value.folders
    .find((element) => element.type === "projects")
    .folder.replace("/srv/ocr4all/", "/home/books/");
  const dirPath = `${basePath}/${project}/sandboxes/${sandbox}/snapshots`;

  for (const set of sets) {
    const filePathParts = set.files[0].path.split("/");
    const basename = filePathParts[filePathParts.length - 1].split(".")[0];
    fileMap[basename] = [];
  }
  for (const set of sets) {
    for (const file of set.files) {
      if (file["mime-type"] !== "application/vnd.prima.page+xml") {
        const filePathParts = file.path.split("/");
        const basename = filePathParts[filePathParts.length - 1].split(".")[0];

        const path = `${dirPath}/${file.path}`;
        fileMap[basename].push(path);
        mimeMap[`${path}`] = file["mime-type"];
      }
    }
  }

  return { fileMap: fileMap, mimeMap: mimeMap };
}

const items = computed(() => {
  if (Object.keys(selection.value).length === 0) {
    return [];
  } else {
    return [
      {
        label: "LAREX",
        icon: IconLarex,
        visible: !hasLarexView(selection.value) && !isExportNode(selection.value) && isCompleted(selection.value),
        disabled: false,
        command: () => {
          generateSandbox(selection.value);
        },
      },
      {
        label: "Unlock Snapshot",
        visible: selectedSnapshotLock.value,
        disabled: false,
        icon: IconUnlock,
        command: () => {
          unlockSnapshot(selection.value);
        },
      },
      {
        label: "Run Processor",
        visible: isCompleted(selection.value),
        disabled: selectedSnapshotLock.value,
        icon: IconStart,
        command: () => {
          openProcessorDialog(selection.value);
        },
      },
      {
        label: "Add to dataset",
        visible: isLarexNode(selection.value) && isCompleted(selection.value),
        disabled: false,
        icon: IconAddToDataset,
        command: () => {
          openAddToDatasetDialog(selection.value) ;
        },
      },
      {
        label: "Export",
        icon: IconExport,
        visible: isCompleted(selection.value),
        disabled: false,
        command: () => {
          openExportSnapshotDialog(selection.value);
        },
      },
      {
        label: "Information",
        visible: true,
        disabled: false,
        icon: IconInformation,
        command: () => {
          openProcessorInformationDialog(selectedSnapshotInformation.value);
        },
      },
    ];
  }
});
</script>
<template>
  <Toast position="bottom-right" group="job">
    <template #container="{ message, closeCallback }">
      <section
        class="grid w-full justify-center gap-3 border bg-surface-100/70 p-3 backdrop-blur-sm dark:border-surface-600 dark:bg-surface-800/80"
        style="border-radius: 10px"
      >
        <div
          v-if="scheduledJobs.includes(message.detail)"
          class="flex w-full flex-col justify-center gap-3 justify-self-center"
        >
          <p
            class="m-0 text-base font-semibold text-primary-950 dark:text-primary-0"
          >
            Processor job is scheduled!
          </p>
          <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
        </div>
        <div
          v-else-if="runningJobs.includes(message.detail)"
          class="flex w-full flex-col justify-center gap-3 justify-self-center"
        >
          <p
            class="m-0 text-base font-semibold text-primary-950 dark:text-primary-0"
          >
            Processor job is running!
          </p>
          <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
        </div>
        <div
          v-else-if="finishedJobs.includes(message.detail)"
          class="flex w-full flex-col justify-center gap-3 justify-self-center"
        >
          <p
            class="m-0 text-base font-semibold text-primary-950 dark:text-primary-0"
          >
            Processor job is finished!
          </p>
          <Button severity="contrast" @click="closeCallback"> Close </Button>
        </div>
      </section>
    </template>
  </Toast>
  <Toast
    position="top-center"
    group="headless"
    @close="sandboxGenerationToastVisible = false"
  >
    <template #container="{ message, closeCallback }">
      <section
        class="grid w-full justify-center gap-3 border bg-surface-100/70 p-3 backdrop-blur-sm dark:border-surface-600 dark:bg-surface-800/80"
        style="border-radius: 10px"
      >
        <div class="flex w-full gap-3 justify-self-center">
          <p
            class="m-0 text-base font-semibold text-primary-950 dark:text-primary-0"
          >
            {{ message.summary }}
          </p>
          <p class="m-0 text-base text-primary-950 dark:text-primary-0">
            {{ message.detail }}
          </p>
        </div>
        <ProgressBar
          v-show="isGeneratingSandbox"
          mode="indeterminate"
          style="height: 6px"
        ></ProgressBar>
      </section>
    </template>
  </Toast>
  <Dock
    class="!z-50 lg:mb-4"
    v-show="Object.entries(selection).length > 0"
    :model="items"
    :dt="actionDock"
    :pt="{
      listContainer: 'backdrop-blur-sm !rounded-0 lg:!rounded-xl',
    }"
  >
    <template #item="{ item }">
      <div v-show="item.visible" class="flex flex-col lg:p-2">
        <Button
          :disabled="item.disabled"
          v-tooltip.top="item.label"
          @click="item.command"
          text
        >
          <component
            :is="item.icon"
            class="h-8 w-8 self-center text-surface-800 dark:text-surface-100"
          />
        </Button>
      </div>
    </template>
  </Dock>
  <div class="flex space-x-6">
    <div
      class="flex-1 rounded-md bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
    >
      <section>
        <h2
          class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
        >
          {{ $t("pages.projects.result-viewer.overview.heading") }}
        </h2>
        <div v-if="nodes && nodes.snapshot" class="overflow-x-auto dark:[color-scheme:dark] pt-1 ">
          <OrganizationChart
            v-if="nodes"
            v-model:selectionKeys="selection"
            :value="nodes"
            collapsible
            selection-mode="single"
            @node-select="collectSnapshotInformation"
          >
            <template #default="slotProps">
              <div class="flex flex-col space-y-2">
                <div class="flex space-x-2">
                  <span class="mx-auto self-center font-bold">
                  {{
                      slotProps.node.label.replace(
                        "LAREX launcher default",
                        "LAREX",
                      )
                    }}
                </span>
                  <span class="absolute flex h-3 w-3 -top-1 -right-1">
                  <span class="absolute inline-flex h-full w-full rounded-full opacity-75" :class="getClassByState(slotProps.node.snapshot.process.state, true)"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 opacity-100" :class="getClassByState(slotProps.node.snapshot.process.state, false)"></span>
              </span>
                </div>
                <Tag
                  :value="slotProps.node.type"
                  :class="getTagClasses(slotProps.node.type)"
                ></Tag>
              </div>
            </template>
          </OrganizationChart>
        </div>
        <div v-else class="flex justify-center">
          <p class="text-black dark:text-white">Error</p>
        </div>
      </section>
    </div>
  </div>
  <form
    id="larexForm"
    ref="larexForm"
    class="hidden justify-self-center"
    :action="configStore.larexUrl"
    method="POST"
    target="_blank"
  >
    <input id="fileMap" v-model="formFileMap" type="hidden" name="fileMap" />
    <input id="mimeMap" v-model="formMimeMap" type="hidden" name="mimeMap" />
    <input id="metsFilePath" value="" type="hidden" name="metsFilePath" />
    <input id="customFlag" value="" type="hidden" name="customFlag" />
    <input id="customFolder" value="" type="hidden" name="customFolder" />
    <input id="modes" value="" type="hidden" name="modes" />
  </form>
</template>
<style></style>
