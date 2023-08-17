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
      <template #empty> {{ $t("pages.dashboard.components.recent-projects.empty") }} </template>
      <template #loading>
        <DefaultSpinner />
      </template>
      <template #header>
        <div class="flex justify-between">
          <div>
            <p>  {{ $t("pages.dashboard.components.recent-projects.header") }} </p>
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
              @click="router.push('/project/overview')"
            />
          </div>
        </div>
      </template>
      <Column
        field="name"
        :header="$t('pages.dashboard.components.recent-projects.columns.project')"
        :sortable="true"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
        >></Column
      >
      <Column
          :header="$t('pages.dashboard.components.recent-projects.columns.state')"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
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
        :header="$t('pages.dashboard.components.recent-projects.columns.last-updated')"
        :sortable="true"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
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
