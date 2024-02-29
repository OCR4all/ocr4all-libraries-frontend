<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import DefaultSpinner from "@/components/Layout/utils/DefaultSpinner.vue";

import { UseTimeAgo } from "@vueuse/components";

import { ArrowPathIcon, ArrowUpOnSquareIcon } from "@heroicons/vue/24/outline";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toast from "primevue/toast";

import { Router } from "vue-router";
const router: Router = useRouter();

const isRefetching: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(true);

const workflows: Ref<object[]> = ref([]);
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
    >
      <template #header>
        <div class="flex justify-between">
          <div>
            <p>{{ $t("pages.dashboard.components.workflows.header") }}</p>
          </div>
          <div class="flex justify-end">
            <button
              v-tooltip="'Refresh'"
              :disabled="isRefetching === true"
              @click="refetch">
              <ArrowPathIcon
                :class="{ 'animate-spin': isRefetching }"
                class="mr-2 h-6 w-6 text-surface-500 hover:text-black dark:text-surface-200 dark:hover:text-white"
              />
            </button>
            <button
              v-tooltip="'Open workflow overview'"
              @click="router.push('/workflows')">
              <ArrowUpOnSquareIcon
                data-tooltip-target="tooltip-project-overview"
                class="h-6 w-6 text-surface-500 hover:cursor-pointer hover:text-black dark:text-surface-200 dark:hover:text-white"

              />
            </button>
          </div>
        </div>
      </template>
      <template #empty
        ><span class="text-primary-950 dark:text-primary-50">{{
          $t("pages.dashboard.components.workflows.empty")
        }}</span></template
      >
      <template #loading>
        <DefaultSpinner />
      </template>
      <Column
        field="label"
        :header="$t('pages.dashboard.components.workflows.columns.name')"
      ></Column>
      <Column
        field="description"
        :header="$t('pages.dashboard.components.workflows.columns.description')"
      ></Column>
      <Column
        :header="$t('pages.dashboard.components.workflows.columns.updated')"
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
