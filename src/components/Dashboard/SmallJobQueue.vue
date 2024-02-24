<script setup>
import { UseTimeAgo } from "@vueuse/components";

import { ArrowPathIcon, ArrowUpOnSquareIcon } from "@heroicons/vue/24/outline";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import { useCustomFetch } from "@/composables/useCustomFetch";
import DefaultSpinner from "@/components/Layout/utils/DefaultSpinner.vue";
import Toast from "primevue/toast";


const router = useRouter();

const loading = ref(true);
const isRefetching = ref(false);
const jobs = ref([]);
async function refetch() {
  isRefetching.value = true;
  useCustomFetch(`/job/overview/administration`)
    .get()
    .json()
    .then((response) => {
      const _jobs = [];
      for (const entries of Object.values(response.data.value)) {
        for (const job of entries) {
          _jobs.push(job);
        }
      }
      loading.value = response.isFetching.value;
      setTimeout(function () {
        isRefetching.value = response.isFetching.value;
      }, 500);
      jobs.value = _jobs;
    });
}

refetch();

const getSeverity = (entry) => {
  switch (entry) {
    case "scheduled":
      return "primary";
    case "running":
      return "success";
    case "interrupted":
      return "danger";
    case "cancelled":
      return "warning";
    case "completed":
      return "success";
    default:
      return null;
  }
};
</script>

<template>
  <Toast />
  <div>
    <DataTable
      :value="jobs"
      stripedRows
      :loading="loading"
      paginator
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      :rows="3"
    >
      <template #empty
        ><span class="text-primary-950 dark:text-primary-50">
          {{ $t("pages.dashboard.components.queue.empty") }}
        </span></template
      >
      <template #loading>
        <DefaultSpinner />
      </template>
      <template #header>
        <div class="flex justify-between">
          <div>
            <p>{{ $t("pages.dashboard.components.queue.header") }}</p>
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
              @click="router.push('/queue')"
            />
          </div>
        </div>
      </template>
      <Column
        field="id"
        :header="$t('pages.dashboard.components.queue.columns.id')"
      ></Column>
      <Column
        field="state"
        :header="$t('pages.dashboard.components.queue.columns.state')"
      >
        <template #body="{ data }">
          <Tag
            class="m-0 p-0"
            :value="data.state"
            :severity="getSeverity(data.state)"
          />
        </template>
      </Column>
      <Column :header="$t('pages.dashboard.components.queue.columns.queued')">
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
