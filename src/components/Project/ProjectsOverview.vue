<script setup lang="ts">
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

import { ArrowPathIcon, EyeIcon } from "@heroicons/vue/24/outline";

import { UseTimeAgo } from "@vueuse/components";

import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();

const loading = ref(true);
const isRefetching = ref(false);

async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(`/project/list`)
    .get()
    .json();
  projects.value = data.value;
  loading.value = isFetching.value;
  setTimeout(function () {
    isRefetching.value = isFetching.value;
  }, 500);
}

const projects = ref();

refetch();

const selectedProjects = ref(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  state: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const getSeverity = (entry) => {
  switch (entry) {
    case "active":
      return "success";
    case "closed":
      return "warning";
    case "blocked":
      return "danger";
    default:
      return null;
  }
};
const states = ref(["active", "closed", "blocked"]);
</script>
<template>
  <div class="card">
    <Toolbar
      :pt="{
        root: { class: '!rounded-xl !bg-white dark:!bg-zinc-800 !border-none !shadow-md' },
      }"
      class="mb-4"
    >
      <template #start>
        <div class="my-2 space-x-2">
          <button
            type="button"
            class="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="router.push('/project/new')"
          >
            {{ $t("pages.projects.overview.toolbar.new") }}
          </button>
          <button
            disabled
            type="button"
            class="rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:bg-blue-400"
            @click="router.push('/project/import')"
          >
            {{ $t("pages.projects.overview.toolbar.import") }}
          </button>
        </div>
      </template>

      <template #end>
        <button :disabled="isRefetching === true" @click="refetch">
          <ArrowPathIcon
            :class="{ 'animate-spin': isRefetching }"
            class="mr-2 inline h-6 w-6 text-gray-600 hover:text-black dark:text-gray-200 hover:dark:text-white"
          />
        </button>
      </template>
    </Toolbar>
    <DataTable
      v-model:selection="selectedProjects"
      :value="projects"
      :paginator="true"
      :rows="10"
      :loading="loading"
      :filters="filters"
      :globalFilterFields="['name', 'description', 'state', 'keywords']"
      sortField="tracking.updated"
      :sortOrder="-1"
      :row-hover="true"
      :pt="{
        header: {
          class: 'rounded-t-xl dark:!bg-zinc-800 dark:!text-white !border-none !shadow-md',
        },
        wrapper: { class: 'dark:!bg-zinc-700 dark:!text-white !border-none' },
        row: { class: 'dark:!bg-zinc-700 dark:!text-white !border-none' },
        emptyMessage: {
          class: 'dark:!bg-zinc-700 dark:!text-white !border-none',
        },
      }"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rows-per-page-options="[10, 25, 50]"
      responsive-layout="scroll"
    >
      <template #header>
        <div class="flex justify-between">
          <h2 class="my-4 text-xl">{{ $t("pages.projects.overview.table.header") }}</h2>
          <span class="p-input-icon-left ml-10">
            <InputText
              v-model="filters['global'].value"
              :placeholder="$t('pages.projects.overview.table.search.placeholder')"
            />
          </span>
        </div>
      </template>
      <template #empty> {{ $t("pages.projects.overview.table.empty") }} </template>
      <template #loading>
        <DefaultSpinner />
      </template>
      <Column
        :exportable="false"
        :header="$t('pages.projects.overview.table.columns.open')"
        style="min-width: 8rem"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <button
            type="button"
            class="mr-2 inline-flex items-center rounded-lg bg-blue-600 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="router.push(`/project/${slotProps.data.id}/view`)"
          >
            <EyeIcon class="h-6 w-6 text-white" />
          </button>
        </template>
      </Column>
      <Column
        field="name"
        :header="$t('pages.projects.overview.table.columns.project')"
        :sortable="true"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      ></Column>
      <Column
        field="description"
        :header="$t('pages.projects.overview.table.columns.description')"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <p class="max-w-xs truncate">{{ slotProps.data.description }}</p>
        </template>
      </Column>
      <Column
        field="state"
        :header="$t('pages.projects.overview.table.columns.state')"
        :showFilterMenu="false"
        :filterMenuStyle="{ width: '14rem' }"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="{ data }">
          <Tag :value="data.state" :severity="getSeverity(data.state)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="states"
            placeholder="Select State"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
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
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option"
                :severity="getSeverity(slotProps.option)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column
          :header="$t('pages.projects.overview.table.columns.keywords')"
        :pt="{
          headerCell: { class: 'dark:!bg-zinc-800 !border-none' },
          headerTitle: { class: 'dark:!text-white !border-none' },
          bodyCell: { class: 'dark:!border-zinc-600' },
        }"
      >
        <template #body="slotProps">
          <Tag
            v-for="keyword in slotProps.data.keywords"
            :key="keyword.name"
            :value="keyword"
            class="mb-1 mr-1 !bg-gray-500"
          />
        </template>
      </Column>
      <Column
        field="tracking.created"
        :header="$t('pages.projects.overview.table.columns.created')"
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
            :time="Date.parse(slotProps.data.tracking.created)"
          >
            {{ timeAgo }}
          </UseTimeAgo>
        </template>
      </Column>
      <Column
        field="tracking.updated"
        :header="$t('pages.projects.overview.table.columns.last-updated')"
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
<style></style>
