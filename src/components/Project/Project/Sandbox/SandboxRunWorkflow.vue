<script setup lang="ts">
import { useSandboxCreationStore } from "@/stores/sandboxCreation.store";

import { IWorkflow } from "@/types/workflow.types";

const store = useSandboxCreationStore();

import IconImageImport from "~icons/lucide/image-plus";
import { useCustomFetch } from "@/composables/useCustomFetch";
import ProgressBar from "primevue/progressbar";
import { IQueue } from "@/components/Queue/queue.interfaces";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const workflows = ref();

const isError = ref(false)
const isRunning = ref(false);
const isImportingImages = ref(false);
const isWorkflowRunning = ref(false);
const isWorkflowFinished = ref(false);

import IconStart from "~icons/codicon/debug-start";
import IconBack from "~icons/solar/rewind-back-outline"

const SANDBOX_LAUNCHER =
  "de.uniwuerzburg.zpd.ocr4all.application.core.spi.launcher.provider.SandboxNormalizedLauncher";

async function refetch() {
  useCustomFetch(`/workflow/list`)
    .get()
    .json()
    .then((response) => {
      workflows.value = response.data.value;
    });
}
refetch();

async function createSandbox(sandboxName: string) {
  const { isFetching, error, data } = await useCustomFetch(
    `/sandbox/create/${project}?id=${sandboxName}`,
  )
    .get()
    .json();
  store.sandboxId = sandboxName;
}

async function checkImageJob(startedJob: number) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/overview/domain`,
      )
        .get()
        .json();
      const queue: IQueue = data.value;
      for (const job of Object.values(queue.done)) {
        console.log(job);
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
    id: SANDBOX_LAUNCHER,
    images: [{ argument: "images", values: store.selectedImages }],
    label: "Import images",
    description: "Import images",
  };
  const { error, data } = await useCustomFetch(
    `/spi/launcher/schedule/${project}/${store.sandboxId}`,
  )
    .post(payload)
    .json();
  if( error.value ){
    isError.value = true
  }else{
    isImportingImages.value = true;
    const startedJob = data.value["job-id"];
    await checkImageJob(startedJob);
  }
}

async function checkWorkflowJob(startedJob: number) {
  return await new Promise((resolve) => {
    const jobInterval = setInterval(async () => {
      const { isFetching, error, data } = await useCustomFetch(
        `/job/overview/domain`,
      )
        .get()
        .json();
      const queue: IQueue = data.value;
      for (const job of Object.values(queue.done)) {
        if (job.id === startedJob && job.state == "completed") {
          jobStatus.value = "Done";
          clearInterval(jobInterval);
          isWorkflowRunning.value = false;
          isWorkflowFinished.value = true;
          resolve(true);
        }
      }
      for (const job of Object.values(queue.running)) {
        if (job.id === startedJob) {
          jobStatus.value = "Running";
          workflowProgress.value = Math.round(job.journal.progress * 100);
        }
      }
      for (const job of Object.values(queue.scheduled)) {
        if (job.id === startedJob) {
          jobStatus.value = "Scheduled";
        }
      }
    }, 1000);
  });
}

const workflowProgress = ref(0);
const jobStatus = ref("Scheduled");

const processorSelector = ref();

async function importImageOnly(){
  isRunning.value = true;
  await createSandbox(
    `Image_Import_${new Date().toISOString().slice(0, -8).replace(":", "-")}`,
  );
  await importImages();
  isRunning.value = false;
}

async function runProcessor() {
  const processor = processorSelector.value.get();

  isRunning.value = true;
  await createSandbox(
    `${processor.processor.name}_${new Date().toISOString().slice(0, -8).replace(":", "-")}`,
  );
  await importImages();

  const url = `/spi/${processor.processor.type}/schedule/${project}/${store.sandboxId}`;

  const payload = {
    id: processor.processor.id,
    label: processor.processor.label,
    description: `Run ${processor.processor.label} on ${store.sandboxId}`,
    "job-short-description": `Run ${processor.processor.label} on ${store.sandboxId}`,
    "parent-snapshot": {
      track: [],
    },
    ...processor.parameters,
  };

  const { isFetching, error, data } = await useCustomFetch(url)
    .post(payload)
    .json();

  if(error.value){
    isError.value = true
  }else{
    isWorkflowRunning.value = true;
    const startedJob = data.value["job-id"];
    await checkWorkflowJob(startedJob);
    isRunning.value = false;
  }
}

async function launchWorkflow(workflow: IWorkflow) {
  isRunning.value = true;

  const sandboxName = `${workflow.label}_${new Date()
    .toISOString()
    .slice(0, -8)
    .replace(":", "-")}`;
  await createSandbox(sandboxName);
  await importImages();

  const { isFetching, error, data } = await useCustomFetch(
    `/workflow/schedule/${project}/${store.sandboxId}/${workflow.id}`,
  )
    .post({
      "job-short-description": `${project}_${store.sandboxId}`,
      "parent-snapshot": {
        track: [],
      },
    })
    .json();
  if(error.value) {
    isError.value = true
  }else{
    isWorkflowRunning.value = true;
    const startedJob = data.value["job-id"];
    await checkWorkflowJob(startedJob);
    isRunning.value = false;
  }
}

const mode = ref("Workflow");
const options = ref(["Workflow", "Processor", "Import"]);
</script>
<template>
  <section v-if="isError">
    <h2
      class="mb-2 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      Something went horribly wrong!
    </h2>
    <h2
      class="mb-8 text-center text-lg font-bold text-surface-700 dark:text-surface-200 sm:text-lg md:text-lg"
    >
      Please go back to the Result Overview and try again.
    </h2>
    <div class="flex justify-center">
      <Button severity="contrast" @click="router.push(`/project/${project}/view`)">
        <div class="flex space-x-2">
          <IconBack />
        </div>
      </Button>
    </div>
  </section>
  <section
    v-else-if="!isRunning && !isWorkflowFinished"
    class="grid items-center space-y-10 px-20 dark:text-surface-100"
  >
    <div class="flex justify-center">
      <SelectButton
        v-model="mode"
        :options="options"
        :allowEmpty="false"
        aria-labelledby="basic"
      />
    </div>
    <section v-if="mode === 'Workflow'">
      <h2
        class="mb-2 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        {{ $t("pages.projects.sandbox.workflow.heading") }}
      </h2>
      <h2
        class="mb-8 text-center text-lg font-bold text-surface-700 dark:text-surface-200 sm:text-lg md:text-lg"
      >
        {{ $t("pages.projects.sandbox.workflow.directive") }}
      </h2>
      <WorkflowChooser label="Run" :icon="IconStart" @submit="launchWorkflow" />
    </section>
    <section v-else-if="mode === 'Processor'">
      <h2
        class="mb-2 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        Select a processor
      </h2>
      <h2
        class="mb-8 text-center text-lg font-bold text-surface-700 dark:text-surface-200 sm:text-lg md:text-lg"
      >
        Select which processor should be used to run on the images
      </h2>
      <ProcessorSelector ref="processorSelector" @submit="runProcessor" />
    </section>
    <section v-else-if="mode === 'Import'">
      <h2
        class="mb-2 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        Only import images
      </h2>
      <h2
        class="mb-8 text-center text-lg font-bold text-surface-700 dark:text-surface-200 sm:text-lg md:text-lg"
      >
        Skip processing for now and only import images
      </h2>
      <div class="flex justify-center">
        <Button @click="importImageOnly">
          <div class="flex space-x-2">
            <IconImageImport />
            <p>Import</p>
          </div>
        </Button>
      </div>
    </section>
  </section>
  <section
    v-else-if="isRunning"
    class="flex flex-col items-center justify-center dark:text-surface-100 sm:p-24"
  >
    <div v-if="isImportingImages">
      <h2
        v-if="isImportingImages"
        class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        {{ $t("pages.projects.sandbox.workflow.importing-images.heading") }}
      </h2>
      <ProgressBar mode="indeterminate"></ProgressBar>
      <h3
        class="pt-4 text-center text-lg text-black dark:text-white sm:text-xl md:text-2xl"
      >
        {{ $t("pages.projects.sandbox.workflow.importing-images.content") }}
      </h3>
    </div>
    <div v-else-if="isWorkflowRunning">
      <h2
        class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
      >
        {{ $t("pages.projects.sandbox.workflow.running-workflows.heading") }}
      </h2>
      <p
        class="text-center text-lg font-semibold text-black dark:text-surface-100"
      >
        Status: {{ jobStatus }}
      </p>
      <ProgressBar :value="workflowProgress"></ProgressBar>
      <h3
        class="pt-4 text-center text-lg text-black dark:text-white sm:text-xl md:text-2xl"
      >
        {{ $t("pages.projects.sandbox.workflow.running-workflows.content") }}
      </h3>
    </div>
  </section>
  <section
    v-else-if="isWorkflowFinished"
    class="flex flex-col items-center justify-center dark:text-surface-100 sm:p-24"
  >
    <h2
      class="m-10 text-center text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.sandbox.workflow.workflow-finished") }}
    </h2>
    <button
      class="rounded-md bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      @click="router.push(`/project/${project}/result/${store.sandboxId}`)"
    >
      {{ $t("pages.projects.sandbox.workflow.buttons.inspect-results") }}
    </button>
  </section>
</template>
