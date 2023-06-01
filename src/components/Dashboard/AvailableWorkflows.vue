<script setup>
import { UseTimeAgo } from "@vueuse/components";

import { ArrowPathIcon, ArrowUpOnSquareIcon } from "@heroicons/vue/24/outline";

import DataTable from "primevue/datatable";
import Column from "primevue/column";

import { useCustomFetch } from "@/composables/useCustomFetch";
import DefaultSpinner from "@/components/Layout/utils/DefaultSpinner.vue";

const router = useRouter();

const isRefetching = ref(false);
const loading = ref(true);

const workflows = ref([]);
async function refetch() {
  isRefetching.value = true;
  useCustomFetch(`/workflow/list`)
    .get()
    .json()
    .then((response) => {
      loading.value = response.isFetching.value;
      setTimeout(function () {
        isRefetching.value = response.isFetching.value;
      }, 500);
      workflows.value = response.data.value;
    });
}

refetch();
</script>

<template>
  <Toast />
  <div>
    <DataTable
      :value="workflows"
      stripedRows
      sortField="date"
      :sortOrder="-1"
      :loading="loading"
      paginator
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      :rows="3"
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
    >
      <template #header>
        <div class="flex justify-between">
          <div>
            <p>Available Workflows</p>
          </div>
          <div class="flex justify-end">
            <button :disabled="isRefetching === true" @click="refetch">
              <ArrowPathIcon
                :class="{ 'animate-spin': isRefetching }"
                class="mr-2 h-6 w-6 text-gray-500 hover:text-black dark:text-gray-200 dark:hover:text-white"
              />
            </button>
            <ArrowUpOnSquareIcon
              data-tooltip-target="tooltip-project-overview"
              class="h-6 w-6 text-gray-500 hover:cursor-pointer hover:text-black dark:text-gray-200 dark:hover:text-white"
              @click="router.push('/workflows')"
            />
          </div>
        </div>
      </template>
      <template #empty>No workflows found.</template>
      <template #loading>
        <DefaultSpinner />
      </template>
      <Column
        field="label"
        header="Name"
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
        header="Updated"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <UseTimeAgo
            v-slot="{ timeAgo }"
            :time="Date.parse(slotProps.data.date)"
          >
            {{ timeAgo }}
          </UseTimeAgo>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
