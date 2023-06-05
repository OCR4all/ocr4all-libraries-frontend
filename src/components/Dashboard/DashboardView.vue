<script setup lang="ts">
import WideCard from "@/components/Dashboard/WideCard.vue";

import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useCustomFetch } from "@/composables/useCustomFetch";
const toast = useToast();

const projects = ref();
const workflows = ref();
const jobs = ref();

useCustomFetch(`/project/list`)
  .get()
  .json()
  .then((response) => {
    projects.value = `${response.data.value.length}`;
  });
useCustomFetch(`/workflow/list`)
  .get()
  .json()
  .then((response) => {
    workflows.value = `${response.data.value.length}`;
  });
useCustomFetch(`/job/overview/administration`)
  .get()
  .json()
  .then((response) => {
    jobs.value = response.data.value;
  });

function startTour() {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Interactive tour not available yet",
    life: 3000,
  });
}

function openSettings() {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Settings not available yet",
    life: 3000,
  });
}
</script>
<template>
  <div class="space-y-8 pb-8">
    <div class="grid grid-cols-2 grid-rows-1 gap-8 xl:grid-cols-3">
      <StatsCard>
        <template #title> Projects </template>
        <template #value>
          <div v-show="projects">
            {{ projects }}
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title> Workflows </template>
        <template #value>
          <div v-show="workflows">
            {{ workflows }}
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title> Queued Jobs </template>
        <template #value>
          <div v-if="jobs">
            {{ jobs.running.length + jobs.scheduled.length }}
          </div>
        </template>
      </StatsCard>
    </div>
    <div class="grid grid-cols-5 grid-rows-1 gap-8 lg:grid-rows-2">
      <div class="col-span-5 row-span-2 xl:col-span-4">
        <div
          class="group m-0 h-full rounded-xl bg-white p-5 shadow dark:bg-zinc-800"
        >
          <RecentProjectsOverview />
        </div>
      </div>
      <div class="col-span-2 row-span-2 xl:col-span-1 xl:row-span-1">
        <a href="https://www.ocr4all.org" target="_blank">
          <IconCard>
            <template #icon>
              <img
                class="m-auto h-20 w-20"
                src="/assets/dashboard/notebook-dynamic-gradient.png"
                alt="Notebook icon"
              />
            </template>
            <template #text> Documentation </template>
          </IconCard>
        </a>
      </div>
      <div class="col-span-3 row-span-2 xl:col-span-1 xl:row-span-1">
        <IconCard class="hover:cursor-pointer" @click="openSettings">
          <template #icon>
            <img
              class="m-auto h-20 w-20"
              src="/assets/dashboard/setting-dynamic-gradient.png"
              alt="Notebook icon"
            />
          </template>
          <template #text>Settings</template>
        </IconCard>
      </div>
    </div>
    <div class="grid grid-cols-4 grid-rows-1 gap-8">
      <div class="col-span-4 row-span-1 2xl:col-span-2">
        <div
          class="group m-0 h-full rounded-xl bg-white p-5 shadow dark:bg-zinc-800"
        >
          <AvailableWorkflows />
        </div>
      </div>
      <div class="col-span-4 row-span-1 2xl:col-span-2">
        <div
          class="group m-0 h-full rounded-xl bg-white p-5 shadow dark:bg-zinc-800"
        >
          <SmallJobQueue />
        </div>
      </div>
    </div>
    <div class="grid grid-flow-col gap-8">
      <div class="col-span-2 row-span-1">
        <WideCard @start-tour="startTour">
          <template #icon>
            <img
              class="m-auto h-20 w-20"
              src="/assets/dashboard/play-dynamic-gradient.png"
              alt="Notebook icon"
            />
          </template>
          <template #subtitle> Explore OCR4all </template>
          <template #title> Start the interactive Tour </template>
        </WideCard>
      </div>
      <div class="col-span-2 row-span-1">
        <NodeFlowCard>
          <template #icon>
            <img
              class="m-auto h-20 w-20"
              src="/assets/dashboard/file-plus-dynamic-gradient.png"
              alt="Notebook icon"
            />
          </template>
          <template #subtitle> NodeFlow editor </template>
          <template #title> Build your own Workflows </template>
        </NodeFlowCard>
      </div>
    </div>
  </div>
  <Toast />
</template>
