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
        `/job/overview/administration`
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
        `/job/overview/administration`
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
      {{ $t("pages.projects.sandbox.workflow.heading") }}
    </h2>
    <h2
      class="mb-8 text-center text-lg font-bold text-gray-700 dark:text-gray-200 sm:text-lg md:text-lg"
    >
      {{ $t("pages.projects.sandbox.workflow.directive") }}
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
      v-if="isImportingImages"
      class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.sandbox.workflow.importing-images") }}
    </h2>
    <div v-else-if="isWorkflowRunning">
      <h2
        class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        {{ $t("pages.projects.sandbox.workflow.running-workflows.heading") }}
      </h2>
      <h3
        class="text-center text-lg text-black dark:text-white sm:text-xl md:text-2xl"
      >
        {{ $t("pages.projects.sandbox.workflow.running-workflows.content") }}
      </h3>
    </div>
    <div class="text-center">
      <DefaultSpinner />
    </div>
  </section>
  <section
    v-else-if="isWorkflowFinished"
    class="flex flex-col items-center justify-center dark:text-gray-100 sm:p-24"
  >
    <h2
      class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.sandbox.workflow.workflow-finished") }}
    </h2>
    <button
      class="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      @click="router.push(`/project/${project}/result/${store.sandboxId}`)"
    >
      {{ $t("pages.projects.sandbox.workflow.buttons.inspect-results") }}
    </button>
  </section>
</template>
