<script setup>
import { ArrowPathIcon, ArrowUpOnSquareIcon } from "@heroicons/vue/24/outline";

import { UseTimeAgo } from "@vueuse/components";

import Tag from "primevue/tag";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { useCustomFetch } from "@/composables/useCustomFetch";
import DefaultSpinner from "@/components/Layout/utils/DefaultSpinner.vue";

const router = useRouter();

const initialLoading = ref(true);
const isRefetching = ref(false);
const projects = ref();

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

function getStateSeverity(state) {
  switch (state) {
    case "finished":
      return "success";
    case "active":
      return "info";
    case "archived":
      return "warning";
  }
}
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
      responsive-layout="scroll"
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
              @click="refetch">
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
        :header="$t('pages.dashboard.components.recent-projects.columns.state')"
        >>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.state"
            :severity="getStateSeverity(slotProps.data.state)"
          />
        </template>
      </Column>
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
