<script setup>
import { UseTimeAgo } from "@vueuse/components";
import { ArrowPathIcon, ArchiveBoxXMarkIcon, StopIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import ProgressBar from "primevue/progressbar";
import { FilterMatchMode } from "primevue/api";

import { useToast } from "primevue/usetoast";
import { useCustomFetch } from "@/composables/useCustomFetch";
const toast = useToast();

const loading = ref(true);
const isRefetching = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  state: { value: null, matchMode: FilterMatchMode.MATCHES },
});

const states = ref([
  "scheduled",
  "running",
  "interrupted",
  "cancelled",
  "completed",
]);
const jobs = ref();

const getColor = (entry) => {
  switch (entry) {
    case "scheduled":
      return { background: "#76A9FA" };
    case "running":
      return { background: "#1A56DB" };
    case "interrupted":
      return { background: "#4B5563" };
    case "cancelled":
      return { background: "#E02424" };
    case "completed":
      return { background: "#046C4E" };
    default:
      return null;
  }
};
async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(
    `/job/overview/administration`
  )
    .get()
    .json();
  const _jobs = [];
  for (const entries of Object.values(data.value)) {
    for (const job of entries) {
      _jobs.push(job);
    }
  }
  loading.value = isFetching.value;
  setTimeout(function () {
    isRefetching.value = isFetching.value;
  }, 500);
  jobs.value = _jobs;
}

refetch();

setInterval(function () {
  refetch();
}, 5000);
async function cancelJob(id) {
  const data = await useCustomFetch(`/job/cancel/${id}`).get().json();
  await refetch().then(() => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Job canceled",
      life: 3000,
    });
  });
}

async function expungeJobs() {
  await useCustomFetch(`job/scheduler/action/expunge`).then(() => {refetch()})
}

async function removeJob(job) {
  await useCustomFetch(`job/remove/${job}`).then(() => {refetch()})
}
</script>

<template>
  <Toast />
  <div
    class="rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-zinc-800"
  >
    <DataTable
      v-model:filters="filters"
      :value="jobs"
      paginator
      filter-display="row"
      :global-filter-fields="['id', 'description', 'state']"
      :loading="loading"
      :rows="5"
      :rows-per-page-options="[5, 10, 20, 50]"
      :pt="{
        header: {
          class: 'rounded-t-xl dark:!bg-zinc-800 dark:!text-white !border-none',
        },
        wrapper: { class: 'dark:!bg-zinc-700 dark:!text-white !border-none' },
        row: { class: 'dark:!bg-zinc-700 dark:!text-white !border-none' },
        emptyMessage: {
          class: 'dark:!bg-zinc-700 dark:!text-white !border-none',
        },
      }"
      table-style="min-width: 50rem"
    >
      <template #empty> Queue is empty... </template>
      <template #header>
        <div class="flex justify-between">
          <h2 class="my-4 text-xl">Job Queue</h2>
          <span class="p-input-icon-left ml-10 space-x-4">
            <button :disabled="isRefetching === true" @click="refetch">
              <ArrowPathIcon
                :class="{ 'animate-spin': isRefetching }"
                class="mr-2 inline h-6 w-6 text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
              />
            </button>
            <button @click="expungeJobs">
                <ArchiveBoxXMarkIcon
                    class="mr-2 inline h-6 w-6 text-gray-800 hover:text-red-600 dark:text-gray-200 dark:hover:text-red-600"
                />
            </button>
            <InputText
              v-model="filters['global'].value"
              placeholder="Search..."
            />
          </span>
        </div>
      </template>
      <Column
        header="Actions"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <button
            :disabled="!['running', 'scheduled'].includes(slotProps.data.state)"
            type="button"
            class="mr-2 inline-flex items-center rounded-lg bg-red-700 p-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 dark:disabled:bg-red-400"
            @click="cancelJob(slotProps.data.id)"
          >
            <StopIcon class="h-6 w-6 text-white" />
          </button>
          <button
              :disabled="['running', 'scheduled'].includes(slotProps.data.state)"
              type="button"
              class="mr-2 inline-flex items-center rounded-lg bg-red-700 p-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 dark:disabled:bg-red-400"
              @click="removeJob(slotProps.data.id)"
          >
            <XMarkIcon class="h-6 w-6 text-white" />
          </button>
        </template>
      </Column>
      <Column
        field="id"
        :sortable="true"
        header="ID"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      ></Column>
      <Column
        field="description"
        header="Description"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      ></Column>
      <Column
        field="state"
        :sortable="true"
        header="State"
        :show-filter-menu="false"
        :filter-menu-style="{ width: '14rem' }"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="{ data }">
          <Tag :value="data.state" :style="getColor(data.state)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            placeholder="Select State"
            :options="states"
            class="p-column-filter"
            :show-clear="true"
            :pt="{
              root: {
                class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
              },
              input: {
                class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
              },
              list: {
                class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
              },
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
            @change="filterCallback()"
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option"
                :style="getColor(slotProps.option)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column
        field="journal.progress"
        header="Progress"
        sortable
        :show-filter-match-modes="false"
        style="min-width: 12rem"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <ProgressBar
            :value="slotProps.data.journal.progress * 100"
            :show-value="false"
            style="height: 6px"
          ></ProgressBar>
        </template>
      </Column>
      <Column
        :sortable="true"
        field="created"
        header="Created"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <UseTimeAgo
            v-slot="{ timeAgo }"
            :time="Date.parse(slotProps.data.created)"
          >
            {{ timeAgo }}
          </UseTimeAgo>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
