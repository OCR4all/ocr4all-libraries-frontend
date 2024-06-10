<script setup lang="ts">
import DefaultSpinner from "@/components/Layout/utils/DefaultSpinner.vue";

import { useCustomFetch } from "@/composables/useCustomFetch";

import { ArrowPathIcon, ArrowUpOnSquareIcon } from "@heroicons/vue/24/outline";

import { UseTimeAgo } from "@vueuse/components";

import Column from "primevue/column";
import DataTable from "primevue/datatable";

const router = useRouter();

const initialLoading: Ref<boolean> = ref(true);
const isRefetching: Ref<boolean> = ref(false);
const projects: Ref = ref();

async function refetch() {
  isRefetching.value = true;
  useCustomFetch(`/project/list`)
    .json()
    .then((response) => {
      initialLoading.value = response.isFetching.value;
      setTimeout(function () {
        isRefetching.value = response.isFetching.value;
      }, 500);
      projects.value = response.data.value;
    });
}

refetch();
</script>

<template>
  <div>
    <DataTable
      :value="projects"
      :paginator="true"
      :rows="5"
      :row-hover="true"
      :loading="initialLoading"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    >
      <template #empty
        ><span class="text-primary-950 dark:text-primary-50">{{
          $t("pages.dashboard.components.recent-projects.empty")
        }}</span></template
      >
      <template #loading>
        <DefaultSpinner />
      </template>
      <template #header>
        <div class="flex justify-between">
          <div>
            <p>{{ $t("pages.dashboard.components.recent-projects.header") }}</p>
          </div>
          <div class="flex justify-end">
            <button
              v-tooltip="'Refresh'"
              :disabled="isRefetching === true"
              @click="refetch"
            >
              <ArrowPathIcon
                :class="{ 'animate-spin': isRefetching }"
                class="mr-2 h-6 w-6 text-surface-500 hover:text-black dark:text-surface-200 dark:hover:text-white"
              />
            </button>
            <button
              v-tooltip="'Open project overview'"
              @click="router.push('/project/overview')"
            >
              <ArrowUpOnSquareIcon
                data-tooltip-target="tooltip-project-overview"
                class="h-6 w-6 text-surface-500 hover:cursor-pointer hover:text-black dark:text-surface-200 dark:hover:text-white"
              />
            </button>
          </div>
        </div>
      </template>
      <Column
        field="name"
        :header="
          $t('pages.dashboard.components.recent-projects.columns.project')
        "
        :sortable="true"
        >></Column
      >
      <Column
        field="tracking.updated"
        :header="
          $t('pages.dashboard.components.recent-projects.columns.last-updated')
        "
        :sortable="true"
      >
        <template #body="slotProps">
          <UseTimeAgo
            v-slot="{ timeAgo }"
            :time="Date.parse(slotProps.data.tracking.updated)"
          >
            {{ timeAgo }}
          </UseTimeAgo>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
