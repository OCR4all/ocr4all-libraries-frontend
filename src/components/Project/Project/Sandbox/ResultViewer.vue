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

import IconUnlock from "~icons/fluent/lock-open-28-filled"
import IconStart from "~icons/fluent/play-circle-28-filled"
import IconAddToDataset from "~icons/fluent/stack-add-24-filled"
import IconExport from "~icons/fluent/cloud-download-28-filled"
import IconLarex from "~icons/fluent/notebook-eye-20-filled";
import IconInformation from "~icons/fluent/info-32-filled"

const authStore = useAuthStore()

const processorDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Sandbox/Dialog/ProcessorDialog.vue"),
);

const exportDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Sandbox/Dialog/ExportSnapshotDialog.vue"),
);

const processorInformationDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Sandbox/Dialog/ProcessorInformationDialog.vue"),
);

const router = useRouter();
const project = router.currentRoute.value.params.project;
const sandbox = router.currentRoute.value.params.sandbox;

const toast = useToast();

const larexLocation = import.meta.env.VITE_PROJECT_LOCATION;
const larexURL = import.meta.env.VITE_LAREX_URL;

const { t } = useI18n();

interface ITrack {
  [key: string]: boolean;
}

interface IFile {
  path: string,
  "mime-type": string,
  "image-id": string
}

interface ISnapshot {
  role: string,
  label: string,
  parameter: string,
  key: number[],
  files: IFile[],
  children: ISnapshot[]
}

const LAREX_LAUNCHER_SPI = "de.uniwuerzburg.zpd.ocr4all.application.core.spi.postcorrection.provider.LAREXLauncher"

const isGeneratingSandbox = ref(false);
const isReady = ref(false);

const selectedSnapshot: Ref<ISnapshot | undefined> = ref();
const selection: Ref<ITrack> = ref({});

const formFileMap = ref();
const formMimeMap = ref();

const selectedSnapshotInformation = ref();
const selectedSnapshotRole = ref();
const selectedSnapshotLock = ref();

const sandboxHome = ref();
const createdTrack = ref();

const nodes = ref();

const sandboxGenerationToastVisible = ref(false);

const LAREX_LABEL = "ocr4all-LAREX-launcher v1.0";

const dialog = useDialog();

function convertSelectionToTrack(selection: ITrack){
  return Object.keys(selection)[0]
    .split(",")
    .map(function(item) {
      return parseInt(item, 10);
    })
}

function openProcessorDialog(snapshot: ITrack) {
  const key = Object.keys(snapshot)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });

  dialog.open(processorDialog, {
    props: {
      header: "Run processor",
      modal: true,
      style: {
        width: '75vw',
      },
      breakpoints:{
        '960px': '75vw',
        '640px': '90vw'
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

async function collectSnapshotInformation(data: ISnapshot) {
  const payload = {
    track: data.key
  }
  useCustomFetch(`/snapshot/entity/${project}/${sandbox}`).post(payload).json().then((response) => {
    selectedSnapshotLock.value = response.data.value.configuration.lock != null
  })
  selectedSnapshotInformation.value = JSON.parse(data.parameter);
  selectedSnapshotRole.value = data.role;
}

async function unlockSnapshot(track: ITrack){
  const payload = {
    track: convertSelectionToTrack(track),
    source: "unlockSnapshot",
    description : `${authStore.user} unlocked the snapshot`
  }
  useCustomFetch(`/snapshot/unlock/${project}/${sandbox}`).post(payload).json().then((response) => {
    if(!response.error.value){
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Snapshot unlocked",
        life: 3000,
      });
      selectedSnapshotLock.value = false
    }
  })
}

async function lockSnapshot(track: ITrack){
  const payload = {
    track: track,
    source: "unlockSnapshot",
    description : `${authStore.user} unlocked the snapshot`
  }
  useCustomFetch(`/snapshot/lock/${project}/${sandbox}`).post(payload).json().then((response) => {
    if(!response.error.value){
      refetch()
    }
  })
}

async function refetch() {
  const { isFetching, error, data } = await useCustomFetch(
    `/sandbox/entity/${project}?id=${sandbox}`,
  )
    .get()
    .json();
  const snapshots = data.value["snapshot-synopsis"];
  if (snapshots !== undefined) {
    const root = snapshots["root-processor"];
    const firstClassChildren = root["derived-processors"];
    const _nodes = {
      key: "input",
      label: "Input",
      children: JSON.parse(
        JSON.stringify(firstClassChildren)
          .replaceAll('"derived-processors":', '"children":')
          .replaceAll('"name":', '"label":')
          .replaceAll('"track":', '"key":'),
      ),
    };
    nodes.value = { ..._nodes };
  }
}

function getSnapshotFromSelection(selection: ITrack): ISnapshot {
  const key = convertSelectionToTrack(selection)
  return useFindNestedObject(nodes, "key", key);
}

async function generateSandbox(selection: ITrack) {
  const snapshotData = getSnapshotFromSelection(selection);
  showSandboxGenerationToast();
  if (snapshotData.label === LAREX_LABEL) {
    createdTrack.value = snapshotData.key;
    isGeneratingSandbox.value = false;
    isReady.value = true;
  } else {
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
      });
    } else {
      isGeneratingSandbox.value = true;
      const startedJob = data.value["job-id"];
      await checkJob(startedJob);
      const jobResponse = await useCustomFetch(`job/entity/${startedJob}`)
        .get()
        .json();
      createdTrack.value =
        jobResponse.data.value.journal.steps["0"]["snapshot-track"];
    }
  }
  const sandboxData = await useCustomFetch(
    `/sandbox/entity/${project}?id=${sandbox}`,
  )
    .get()
    .json();

  /* Very ugly hack that should be removed when the new LAREX version is available */
  sandboxHome.value = sandboxData.data.value["snapshot-synopsis"][
    "home"
  ].replace(larexLocation, "/home/books/");
  const fileMap = {};
  const mimeMap = {};

  const files = useFindNestedObject(
    sandboxData.data.value,
    "track",
    createdTrack.value,
  ).files;
  const lookupMap = {};
  for (const file of files) {
    if (file["mime-type"] === "application/vnd.prima.page+xml") {
      lookupMap[file["image-id"]] = file["path"]
        .split("/")
        .splice(-1)[0]
        .split(".")[0];
      fileMap[file["path"].split("/").splice(-1)[0].split(".")[0]] = [];
    }
  }
  for (const file of files) {
    if (file["mime-type"] !== "application/vnd.prima.page+xml") {
      fileMap[lookupMap[file["image-id"]]] = fileMap[
        lookupMap[file["image-id"]]
      ].concat([sandboxHome.value + "/" + file["path"]]);
      mimeMap[sandboxHome.value + "/" + file["path"]] = file["mime-type"];
    }
  }
  formFileMap.value = JSON.stringify(fileMap);
  formMimeMap.value = JSON.stringify(mimeMap);
  refetch();
}

async function addToDataset(selection: ITrack) {
  const key = convertSelectionToTrack(selection)
  const payload = {
    track: key,
    "collection-id": "string",
    keywords: true,
  };
  useCustomFetch(`/snapshot/collection/all/${project}/${sandbox}`)
    .post(payload)
    .then((response) => {});
}

function hasLarexView(selection: ITrack): boolean {
  const snapshot = getSnapshotFromSelection(selection);
  return snapshot.children
    .map((entry) => entry.label)
    .includes("ocr4all-LAREX-launcher v1.0");
}

function openProcessorInformationDialog(information: unknown) {
  dialog.open(processorInformationDialog, {
    props: {
      header: "Processor information",
      modal: true,
      style: {
        width: '75vw',
      },
      breakpoints:{
        '960px': '75vw',
        '640px': '90vw'
      },
    },
    data: {
      information: information,
    },
  });
}

function openExportSnapshotDialog(snapshot: ITrack) {
  const key = Object.keys(snapshot)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });
  dialog.open(processorInformationDialog, {
    props: {
      header: "Export snapshot",
      modal: true,
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
          isReady.value = true;
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
      }
    },
    dark: {
      root: {
        borderColor: "{surface.600}",
        itemPadding: "0px",
      },
    }
  }
});

const items = computed(() => {
  if(Object.keys(selection.value).length === 0) {
    return false
  }else{
    return [
      {
        label:  "LAREX",
        icon: IconLarex,
        visible: !hasLarexView(selection.value),
        disabled: false,
        command: () => {
          generateSandbox(selection.value)
        }
      },
      {
        label: 'Unlock Snapshot',
        visible: selectedSnapshotLock.value,
        disabled: false,
        icon: IconUnlock,
        command: () => {
          unlockSnapshot(selection.value)
        }
      },
      {
        label: 'Run Processor',
        visible: true,
        disabled: selectedSnapshotLock.value,
        icon: IconStart,
        command: () => {
          openProcessorDialog(selection.value)
        }
      },
      {
        label: 'Add to dataset',
        visible: true,
        disabled: false,
        icon: IconAddToDataset
      },
      {
        label: 'Export',
        icon: IconExport,
        visible: true,
        disabled: false,
        command: () => {
          openExportSnapshotDialog(selection.value)
        }
      },
      {
        label: "Processor Information",
        visible: true,
        disabled: false,
        icon: IconInformation,
        command: () => {
          openProcessorInformationDialog(selectedSnapshotInformation.value)
        }
      }
    ]
  }
})

</script>
<template>
  <Toast />
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
        <form
          v-show="isReady"
          id="larexForm"
          class="justify-self-center"
          :action="larexURL"
          method="POST"
          target="_blank"
        >
          <input
            id="fileMap"
            v-model="formFileMap"
            type="hidden"
            name="fileMap"
          />
          <input
            id="mimeMap"
            v-model="formMimeMap"
            type="hidden"
            name="mimeMap"
          />
          <input id="metsFilePath" value="" type="hidden" name="metsFilePath" />
          <input id="customFlag" value="" type="hidden" name="customFlag" />
          <input id="customFolder" value="" type="hidden" name="customFolder" />
          <input id="modes" value="" type="hidden" name="modes" />
          <button
            type="submit"
            name="action"
            class="rounded-md bg-primary-600 p-2 text-surface-50 hover:bg-primary-800"
            @click="closeCallback"
          >
            Open
          </button>
          <Button
            label="Close"
            text
            class="px-2 py-1"
            @click="closeCallback"
          ></Button>
        </form>
      </section>
    </template>
  </Toast>
  <Dock class="lg:mb-4" v-show="Object.entries(selection).length > 0" :model="items" :dt="actionDock" :pt="{
    listContainer: 'backdrop-blur-sm !rounded-0 lg:!rounded-xl'
  }">
    <template #item="{ item }">
      <div v-show="item.visible" class="flex flex-col lg:p-2">
        <Button :disabled="item.disabled" v-tooltip.top="item.label" @click="item.command" text>
          <component :is="item.icon" class="self-center dark:text-surface-100 text-surface-800 w-8 h-8" />
        </Button>
      </div>
    </template>
  </Dock>
  <div class="flex space-x-6">
    <div
      class="flex-1 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
    >
      <section>
        <h2
          class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
        >
          {{ $t("pages.projects.result-viewer.overview.heading") }}
        </h2>
        <div class="overflow-x-auto dark:[color-scheme:dark]">
          <OrganizationChart
            v-if="nodes"
            v-model:selectionKeys="selection"
            :value="nodes"
            collapsible
            selection-mode="single"
            @node-select="collectSnapshotInformation"
          >
            <template #default="slotProps">
              <div class="flex flex-col">
                <div class="flex items-center">
                  <span class="mb-2 font-bold">
                    {{ slotProps.node.label
                      .split(" ")[0]
                      .replace("ocr4all-LAREX-launcher", "LAREX")
                  }}</span>
                </div>
              </div>
            </template>
          </OrganizationChart>
        </div>
        <div class="card overflow-x-auto"></div>
      </section>
    </div>
  </div>
</template>
<style>

</style>
