<script setup lang="ts">
import { useFindNestedObject } from "@/composables/useFindNestedObject";

import OrganizationChart from "primevue/organizationchart";
import Button from "primevue/button";
import Toast from "primevue/toast";

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const project = router.currentRoute.value.params.project;
const sandbox = router.currentRoute.value.params.sandbox;

const toast = useToast();

const larexLocation = import.meta.env.VITE_LAREX_LOCATION;
const larexURL = import.meta.env.VITE_LAREX_URL;

import { useI18n } from "vue-i18n";
import { TransitionRoot } from "@headlessui/vue";
import ProgressBar from "primevue/progressbar";
const { t } = useI18n();

const isGeneratingSandbox = ref(false);
const isReady = ref(false);

const selectedSnapshot = ref(null);
const selection = ref({});

const formFileMap = ref();
const formMimeMap = ref();

const selectedSnapshotInformation = ref();
const selectedSnapshotRole = ref();

const sandboxHome = ref();
const createdTrack = ref();

const nodes = ref();

const sandboxGenerationToastVisible = ref(false);
const showSandboxGenerationToast = () => {
  if (!sandboxGenerationToastVisible.value) {
    toast.add({
      severity: "custom",
      summary: "Generating Result View",
      group: "headless",
    });
    sandboxGenerationToastVisible.value = true;
  }
};

function collectSnapshotInformation(data: object) {
  selectedSnapshotInformation.value = JSON.parse(data.parameter);
  selectedSnapshotRole.value = data.role;
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

async function generateSandbox(selection: object) {
  const key = Object.keys(selection)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });
  const snapshotData = useFindNestedObject(nodes, "key", key);
  showSandboxGenerationToast();
  if (snapshotData.label === "ocr4all-LAREX-launcher v1.0") {
    createdTrack.value = snapshotData.key;
    isGeneratingSandbox.value = false;
    isReady.value = true;
  } else {
    selectedSnapshot.value = snapshotData;
    const payload = {
      id: "de.uniwuerzburg.zpd.ocr4all.application.core.spi.postcorrection.provider.LAREXLauncher",
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

async function exportSnapshot(snapshot){
  const key = Object.keys(snapshot)[0]
    .split(",")
    .map(function (item) {
      return parseInt(item, 10);
    });
  const payload = {
    track: key
  }
  useCustomFetch(
    `/snapshot/zip/${project}/${sandbox}`
  )
    .post(payload)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project}_${sandbox}_${key.toString()}.zip`);
      document.body.appendChild(link);
      link.click();
    })
}
async function checkJob(startedJob) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/overview/administration`,
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

const breadcrumbHome = { to: "/project/overview", label: "Projects" };
const breadcrumbPaths = [{ to: `/project/${project}/view`, label: project }];
const breadcrumbCurrent = { label: sandbox };
</script>
<template>
  <BreadcrumbNavigation
    :home="breadcrumbHome"
    :path="breadcrumbPaths"
    :current="breadcrumbCurrent"
  />
  <Toast />
  <Toast
    position="top-center"
    group="headless"
    @close="sandboxGenerationToastVisible = false"
  >
    <template #container="{ message, closeCallback }">
      <section
        class="grid w-full justify-center gap-3 p-3"
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
        <div class="flex gap-2 justify-self-center">
          <ProgressBar
            v-show="isGeneratingSandbox"
            mode="indeterminate"
            style="height: 6px"
          ></ProgressBar>
        </div>
        <form
          class="justify-self-center"
          v-show="isReady"
          id="larexForm"
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
            class="bg-primary-300 p-2 text-surface-50 hover:bg-primary-500"
          >
            Open
          </button>
        </form>
        <div class="mb-3 flex gap-3 justify-self-center">
          <Button
            label="Close"
            text
            class="px-2 py-1"
            @click="closeCallback"
          ></Button>
        </div>
      </section>
    </template>
  </Toast>
  <div class="flex space-x-6">
    <div
      class="flex-1 rounded-lg bg-white p-5 shadow-md dark:border dark:border-gray-700 dark:bg-zinc-800"
    >
      <section>
        <h2
          class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
        >
          {{ $t("pages.projects.result-viewer.overview.heading") }}
        </h2>
        <div class="overflow-x-scroll">
          <OrganizationChart
            v-if="nodes"
            @node-select="collectSnapshotInformation"
            v-model:selectionKeys="selection"
            :value="nodes"
            collapsible
            selectionMode="single"
          >
            <template #default="slotProps">
              <div class="flex flex-col">
                <div class="flex flex-col items-center">
                  <span class="mb-2 font-bold">{{
                    slotProps.node.label.split(" ")[0]
                  }}</span>
                </div>
              </div>
            </template>
          </OrganizationChart>
        </div>
        <div class="card overflow-x-auto"></div>
      </section>
    </div>
    <TransitionRoot
      :show="Object.entries(selection).length > 0"
      as="div"
      class="w-128 flex-1 rounded-lg bg-white p-5 shadow-md dark:border dark:border-gray-700 dark:bg-zinc-800"
      enter="transform transition ease-in-out duration-200"
      enter-from="translate-x-full"
      enter-to="translate-x-0"
      leave="transform transition ease-in-out duration-200  "
      leave-from="translate-x-0"
      leave-to="translate-x-full"
    >
      <div class="flex space-x-2 pb-6">
        <Button
          @click="generateSandbox(selection)"
          v-tooltip="{ value: 'Generate Result View', hideDelay: 300 }"
          :pt="{
            root: {
              class: 'p-2 bg-primary-600 hover:bg-primary-700 text-surface-50',
            },
          }"
        >
          Generate Result View
        </Button>
        <Button
          @click="exportSnapshot(selection)"
          v-tooltip="{ value: 'Export Snapshot', hideDelay: 300 }"
          :pt="{
            root: {
              class: 'p-2 bg-primary-600 hover:bg-primary-700 text-surface-50',
            },
          }"
        >
          Export
        </Button>
      </div>
      <h2
        class="pb-2 text-2xl font-semibold text-surface-950 dark:text-surface-50"
      >
        Info
      </h2>
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-zinc-700 dark:text-white"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Parameter</th>
            <th scope="col" class="px-6 py-3">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(value, key) in Object.entries(selectedSnapshotInformation)"
            :key="key"
            class="border-b bg-white dark:border-gray-700 dark:bg-zinc-800"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              {{ value[0] }}
            </th>
            <td class="px-6 py-4 dark:text-white">
              {{ value[1] }}
            </td>
          </tr>
        </tbody>
      </table>
    </TransitionRoot>
  </div>
</template>
