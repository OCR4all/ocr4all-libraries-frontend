<script setup lang="ts">
import { useSandboxCreationStore } from "@/stores/sandboxCreation.store";
import Dropdown from "primevue/dropdown";

const store = useSandboxCreationStore();

import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const workflows = ref();

const selectedWorkflow = ref();

const isRunning = ref(false);
const isImportingImages = ref(false);
const isWorkflowRunning = ref(false);
const isWorkflowFinished = ref(false);
async function refetch() {
  useCustomFetch(`/workflow/list`)
    .get()
    .json()
    .then((response) => {
      workflows.value = response.data.value;
    });
}
refetch();

async function createSandbox() {
  const sandboxName = `${selectedWorkflow.value.label}_${new Date()
    .toISOString()
    .slice(0, -8)
    .replace(":", "-")}`;
  const { isFetching, error, data } = await useCustomFetch(
    `/sandbox/create/${project}?id=${sandboxName}`
  )
    .get()
    .json();
  store.sandboxId = sandboxName;
}

async function checkImageJob(startedJob) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/scheduler/snapshot/administration`
      )
        .get()
        .json();
      for (const job of Object.values(data.value.done)) {
        if (job.id === startedJob && job.state == "completed") {
          clearInterval(jobInterval);
          isImportingImages.value = false;
          resolve(true);
        }
      }
    }, 5000);
  });
}

async function importImages() {
  const payload = {
    id: "de.uniwuerzburg.zpd.ocr4all.application.core.spi.launcher.provider.SandboxLauncher",
    images: [{ argument: "images", values: store.selectedImages }],
    label: "Import images",
    description: "Import images",
  };
  const _sandboxLaunchData = await useCustomFetch(
    `/spi/launcher/schedule/${project}/${store.sandboxId}`
  )
    .post(payload)
    .json();
  isImportingImages.value = true;
  const startedJob = _sandboxLaunchData.data.value["job-id"];
  await checkImageJob(startedJob);
}

async function checkWorkflowJob(startedJob) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/scheduler/snapshot/administration`
      )
        .get()
        .json();
      for (const job of Object.values(data.value.done)) {
        if (job.id === startedJob && job.state == "completed") {
          clearInterval(jobInterval);
          isWorkflowRunning.value = false;
          isWorkflowFinished.value = true;
          resolve(true);
        }
      }
    }, 5000);
  });
}
async function launchWorkflow() {
  isRunning.value = true;
  await createSandbox();
  await importImages();

  const { isFetching, error, data } = await useCustomFetch(
    `/workflow/schedule/${project}/${store.sandboxId}/${selectedWorkflow.value.id}`
  )
    .post({
      "job-short-description": `${project}_${store.sandboxId}`,
      "parent-snapshot": {
        track: [],
      },
    })
    .json();
  isWorkflowRunning.value = true;
  const startedJob = data.value["job-id"];
  await checkWorkflowJob(startedJob);
  isRunning.value = false;
}
</script>
<template>
  <section
    v-if="!isRunning && !isWorkflowFinished"
    class="flex flex-col items-center justify-center dark:text-gray-100 sm:p-24"
  >
    <h2
      class="mb-2 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      Select a workflow
    </h2>
    <h2
      class="mb-8 text-center text-lg font-bold text-gray-700 dark:text-gray-200 sm:text-lg md:text-lg"
    >
      Select which workflow should be used to generate results
    </h2>
    <Dropdown
      v-model="selectedWorkflow"
      :options="workflows"
      filter
      option-label="label"
      placeholder="Select a workflow"
      class="mb-4 w-fit"
      :pt="{
        root: { class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none' },
        input: {
          class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
        },
        list: { class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none' },
        header: {
          class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
        },
        filterContainer: {
          class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
        },
        item: {
          class:
            'dark:!bg-zinc-700 dark:hover:!bg-zinc-500 dark:!text-white dark:!border-none',
        },
      }"
    />
    <button
      class="inline-block w-32 rounded-lg bg-blue-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-blue-600 focus-visible:ring active:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-400 md:text-base"
      :disabled="!selectedWorkflow"
      @click="launchWorkflow"
    >
      Launch
    </button>
  </section>
  <section
    v-else-if="isRunning"
    class="flex flex-col items-center justify-center dark:text-gray-100 sm:p-24"
  >
    <h2
      class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      <span v-if="isImportingImages"> Images are getting imported! </span>
      <span v-else-if="isWorkflowRunning"> Workflow is running! </span>
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
    v-else-if="isWorkflowFinished"
    class="flex flex-col items-center justify-center dark:text-gray-100 sm:p-24"
  >
    <h2
      class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      Workflow finished!
    </h2>
    <button
      class="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      @click="router.push(`/project/${project}/result/${store.sandboxId}`)"
    >
      Inspect Result
    </button>
  </section>
</template>
