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

const authStore = useAuthStore()

const processorDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Sandbox/Dialog/ProcessorDialog.vue"),
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
    if(response.error.value){
      refetch()
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
    if(response.error.value){
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

async function exportSnapshot(snapshot: ITrack) {
  const key = Object.keys(snapshot)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });
  const payload = {
    track: key,
  };
  useCustomFetch(`/snapshot/zip/${project}/${sandbox}`)
    .post(payload)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${project}_${sandbox}_${key.toString().replace(",", "_")}.zip`,
      );
      document.body.appendChild(link);
      link.click();
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
  <div class="flex space-x-6">
    <transition
      class="w-128 flex-1 rounded-md border bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
      enter-active-class="transition ease-in-out duration-200 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-200 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div v-if="Object.entries(selection).length > 0">
        <div class="grid grid-cols-1 gap-y-2">
          <button
            v-show="!hasLarexView(selection)"
            class="inline-block rounded-md bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
            @click="generateSandbox(selection)"
          >
            <span
              v-if="getSnapshotFromSelection(selection).label === LAREX_LABEL"
            >
              Open
            </span>
            <span v-else> Open in LAREX </span>
          </button>
          <button
            v-if="selectedSnapshotLock"
            class="inline-block rounded-md bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
            @click="unlockSnapshot(selection)"
          >
              Unlock
          </button>
          <button
            v-else
            class="inline-block rounded-md bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
            @click="lockSnapshot(selection)"
          >
            Lock
          </button>
          <button
            v-show="!selectedSnapshotLock"
            class="inline-block rounded-md bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
            @click="openProcessorDialog(selection)"
          >
            Run processor
          </button>
          <button
            v-show="!hasLarexView(selection)"
            class="inline-block rounded-md bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
            @click="pushToDataset(selection)"
          >
            Add to dataset
          </button>
          <button
            class="inline-block rounded-md bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
            @click="exportSnapshot(selection)"
          >
            Export
          </button>
        </div>
        <Accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
          <AccordionPanel value="information">
            <AccordionHeader>Processor Information</AccordionHeader>
            <AccordionContent>
              <table
                class="w-full text-left text-sm text-surface-500 dark:text-surface-400"
              >
                <thead
                  class="bg-surface-50 text-xs uppercase text-surface-700 dark:bg-zinc-700 dark:text-white"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Parameter</th>
                    <th scope="col" class="px-6 py-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(value, key) in Object.entries(
                      selectedSnapshotInformation,
                    )"
                    :key="key"
                    class="border-b bg-white dark:border-surface-800 dark:bg-surface-900"
                  >
                    <th
                      scope="row"
                      class="whitespace-nowrap px-6 py-4 font-medium text-surface-900 dark:text-white"
                    >
                      {{ value[0] }}
                    </th>
                    <td class="px-6 py-4 dark:text-white">
                      {{ value[1] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </transition>
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
