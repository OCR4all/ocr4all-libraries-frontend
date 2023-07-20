<script setup lang="ts">
import { EyeIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";

import Tree from "primevue/tree";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useToast } from "primevue/usetoast";
import {type} from "os";

const router = useRouter();
const project = router.currentRoute.value.params.project;
const sandbox = router.currentRoute.value.params.sandbox;

const toast = useToast();

const isGeneratingSandbox = ref(false);
const isReady = ref(false);

const selectedSnapshot = ref(null);

const formFileMap = ref();
const formMimeMap = ref();

const snapshotInformationDialogData = ref();

const sandboxHome = ref();
const createdTrack = ref();

const isSnapshotInfoDialogVisible = ref(false);

const nodes = ref();
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

function showSnapshotInfo(data) {
  snapshotInformationDialogData.value = JSON.parse(data.parameter);
  isSnapshotInfoDialogVisible.value = true;
}

async function refetch() {
  const { isFetching, error, data } = await useCustomFetch(
    `/sandbox/entity/${project}?id=${sandbox}`
  )
    .get()
    .json();
  const snapshots = data.value["snapshot-synopsis"];
  if (snapshots !== undefined) {
    const root = snapshots["root-processor"];
    const firstClassChildren = root["derived-processors"];
    nodes.value = JSON.parse(
      JSON.stringify(firstClassChildren)
        .replaceAll('"derived-processors":', '"children":')
        .replaceAll('"name":', '"label":')
        .replaceAll('"track":', '"key":')
    );
  }
}

refetch();

async function deleteSnapshot(snapshotData) {
  const payload = {
    track: Array.from(snapshotData.key),
  };
  console.log(payload);
  const { isFetching, error, data } = await useCustomFetch(
    `/snapshot/remove/${project}/${sandbox}`
  )
    .post(payload)
    .json();
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Snapshot removed",
    life: 3000,
  });
  await refetch();
}

function findNestedObj(entireObj, keyToFind, valToFind) {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (
      nestedValue &&
      JSON.stringify(nestedValue[keyToFind as string]) ===
        JSON.stringify(valToFind)
    ) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
}

async function generateSandbox(snapshotData) {
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
      `/spi/postcorrection/schedule/${project}/${sandbox}`
    )
      .post(payload)
      .json();
    if(error.value){
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Couldn't schedule result view",
        life: 3000,
      })
    }else{
      isGeneratingSandbox.value = true;
      const startedJob = data.value["job-id"];
      await checkJob(startedJob);
      const jobResponse = await useCustomFetch(
          `job/entity/${startedJob}`
      )
          .get()
          .json()
      createdTrack.value = jobResponse.data.value.journal.steps["0"]["snapshot-track"]
    }
  }
  const sandboxData = await useCustomFetch(
    `/sandbox/entity/${project}?id=${sandbox}`
  )
    .get()
    .json();

  /* Very ugly hack that should be removed when the new LAREX version is available */
  sandboxHome.value = sandboxData.data.value["snapshot-synopsis"][
    "home"
  ].replace(import.meta.env.VITE_LAREX_LOCATION, "/home/books/");
  const fileMap = {};
  const mimeMap = {};

  const files = findNestedObj(
    sandboxData.data.value,
    "track",
    createdTrack.value
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
}
async function checkJob(startedJob) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/overview/administration`
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
  <div
    class="rounded-lg bg-white p-5 shadow-md dark:border dark:border-gray-700 dark:bg-zinc-800"
  >
    <section v-if="!isGeneratingSandbox && !isReady">
      <h2
        class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        Result Viewer
      </h2>
      <div class="mb-4 flex flex-wrap gap-2">
        <Button
          type="button"
          icon="pi pi-plus"
          label="Expand All"
          @click="expandAll"
        />
        <Button
          type="button"
          icon="pi pi-minus"
          label="Collapse All"
          @click="collapseAll"
        />
      </div>
      <Tree
        v-model:expandedKeys="expandedKeys"
        :value="nodes"
        :filter="true"
        filter-mode="lenient"
        :pt="{
          root: {
            class:
              'w-full md:w-30rem dark:bg-zinc-800 dark:!border-zinc-700 dark:text-white',
          },
          node: { class: 'p-5' },
          content: ({ props, state, context }) => ({
            class: context.expanded
              ? 'dark:bg-zinc-700 bg-gray-100'
              : 'undefined',
          }),
        }"
        class="md:w-30rem w-full"
      >
        <template #default="slotProps">
          <div class="flex justify-between space-x-5 px-10 py-5">
            <span class="pt-3">{{ slotProps.node.label }}</span>
            <button
              type="button"
              class="inline-flex items-center rounded-full border border-blue-700 p-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
              @click="generateSandbox(slotProps.node)"
            >
              <EyeIcon class="text-blue h-6 w-6" />
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-full border border-gray-700 p-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-white dark:focus:ring-gray-800"
              @click="showSnapshotInfo(slotProps.node)"
            >
              <InformationCircleIcon class="text-blue h-6 w-6" />
            </button>
            <!--            <button
              @click="deleteSnapshot(slotProps.node)"
              type="button"
              class="inline-flex items-center rounded-full border border-red-700 p-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:ring-red-800"
            >
              <XMarkIcon class="text-blue h-6 w-6" />
            </button>-->
          </div>
        </template>
      </Tree>
    </section>
    <section
      v-else-if="isGeneratingSandbox && !isReady"
      class="flex flex-col items-center justify-center dark:text-gray-100 sm:p-24"
    >
      <h2
        class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        Preparing Result Viewing
      </h2>
      <div class="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="mr-2 inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </section>
    <section
      v-else
      class="flex flex-col items-center justify-center dark:text-gray-100 sm:p-24"
    >
      <h2
        class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        Results are ready to be viewed in LAREX
      </h2>
      <form
        id="larexForm"
        :action="import.meta.env.VITE_LAREX_LOCATION"
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
          class="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-xl font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Open
        </button>
      </form>
    </section>
  </div>
  <Dialog
    v-model:visible="isSnapshotInfoDialogVisible"
    modal
    header="Processor Information"
    :style="{ width: '50vw' }"
    :pt="{
      root: { class: 'dark:!bg-zinc-800' },
      header: { class: 'dark:!bg-zinc-800' },
      headerTitle: { class: 'dark:!text-white' },
      headerIcons: { class: 'dark:!text-white' },
      closeButton: { class: 'dark:!text-white' },
      content: { class: 'dark:!bg-zinc-800' },
    }"
  >
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
          v-for="(value, key, index) in snapshotInformationDialogData"
          :key="key"
          class="border-b bg-white dark:border-gray-700 dark:bg-zinc-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
          >
            {{ key }}
          </th>
          <td class="px-6 py-4 dark:text-white">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </Dialog>
</template>
