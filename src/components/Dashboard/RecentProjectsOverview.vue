<script setup lang="ts">
import DefaultSpinner from "@/components/Layout/utils/DefaultSpinner.vue";

import { useCustomFetch } from "@/composables/useCustomFetch";

import IconOpen from "~icons/heroicons/arrow-up-on-square";

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
      projects.value = response.data.value.splice(0, 5);
    });
}

const rowClass = (data) => {
  return ["cursor-pointer"];
};

refetch();
</script>

<template>
  <div>
    <DataTable
      :value="projects"
      :rows="5"
      :loading="initialLoading"
      @row-click="router.push(`/project/${$event.data.id}/view`)"
      :rowClass="rowClass"
      :row-hover="true"
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
            <p class="font-bold">
              {{ $t("pages.dashboard.components.recent-projects.header") }}
            </p>
          </div>
          <div class="flex justify-end">
            <button
              v-tooltip.left="'Open project overview'"
              @click="router.push('/project/overview')"
            >
              <IconOpen
                data-tooltip-target="tooltip-project-overview"
                class="h-6 w-6 text-surface-500 hover:cursor-pointer hover:text-black dark:text-surface-200 dark:hover:text-white"
              />
            </button>
          </div>
        </div>
      </template>
      <Column
        field="name"
        class="max-w-xs truncate"
        :header="
          $t('pages.dashboard.components.recent-projects.columns.project')
        "
      ></Column>
      <Column
        field="tracking.updated"
        :header="
          $t('pages.dashboard.components.recent-projects.columns.last-updated')
        "
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
