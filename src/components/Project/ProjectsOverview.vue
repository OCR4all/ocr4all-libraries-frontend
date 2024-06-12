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
import RefreshIconButton from "@/components/ui/RefreshIconButton.vue";
import { useUiStore } from "@/stores/ui.store";

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
  keywords: { value: null, matchMode: FilterMatchMode.IN },
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

const uiStore = useUiStore()
uiStore.breadcrumb = [
  {
    label: "Projects",
    to: "/project/overview"
  },
]
</script>
<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <div class="my-2 space-x-2">
          <ActionButton
            rounded
            size="large"
            type="primary"
            @click="router.push('/project/new')"
          >
            {{ $t("pages.projects.overview.toolbar.new") }}
          </ActionButton>
          <ActionButton
            disabled
            type="primary"
            size="large"
            rounded
            @click="router.push('/project/import')"
          >
            {{ $t("pages.projects.overview.toolbar.import") }}
          </ActionButton>
        </div>
      </template>

      <template #end>
        <button
          v-tooltip="'Refresh'"
          :disabled="isRefetching === true"
          @click="refetch"
        >
          <ArrowPathIcon
            :class="{ 'animate-spin': isRefetching }"
            class="mr-2 inline h-6 w-6 text-surface-600 hover:text-black dark:text-surface-200 hover:dark:text-white"
          />
        </button>
      </template>
    </Toolbar>
    <DataTable
      :value="projects"
      :paginator="true"
      :rows="10"
      :loading="loading"
      scrollable
      v-model:filters="filters"
      filter-display="row"
      :globalFilterFields="['name', 'state', 'keywords']"
      sortField="tracking.updated"
      :sortOrder="-1"ack
      :row-hover="true"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #header>
        <div class="flex justify-between">
          <h2 class="my-4 text-xl">
            {{ $t("pages.projects.overview.table.header") }}
          </h2>
          <span class="p-input-icon-left ml-10">
            <InputText
              v-model="filters['global'].value"
              :placeholder="
                $t('pages.projects.overview.table.search.placeholder')
              "
            />
          </span>
        </div>
      </template>
      <template #empty>
        <span class="text-primary-950 dark:text-primary-50">{{
          $t("pages.projects.overview.table.empty")
        }}</span>
      </template>
      <template #loading>
        <DefaultSpinner />
      </template>
      <Column :exportable="false">
        <template #body="slotProps">
          <button
            type="button"
            class="mr-2 inline-flex items-center rounded-md bg-blue-600 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="router.push(`/project/${slotProps.data.id}/view`)"
          >
            {{ $t("pages.projects.overview.table.columns.open") }}
          </button>
        </template>
      </Column>
      <Column
        field="name"
        :header="$t('pages.projects.overview.table.columns.project')"
        :sortable="true"
      ></Column>
      <Column
        field="description"
        :header="$t('pages.projects.overview.table.columns.description')"
      >
        <template #body="slotProps">
          <p class="max-w-[10rem] truncate">{{ slotProps.data.description }}</p>
        </template>
      </Column>
      <Column
        field="state"
        :header="$t('pages.projects.overview.table.columns.state')"
        :filterMenuStyle="{ width: '14rem' }"
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
            style="min-width: 5rem; max-width: 12rem"
            :showClear="true"
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
      <Column :header="$t('pages.projects.overview.table.columns.keywords')">
        <template #body="slotProps">
          <Tag
            v-for="keyword in slotProps.data.keywords"
            :key="keyword.name"
            :value="keyword"
            :pt="{
              root: { class: 'text-xs font-bold bg-surface-200 inline-flex items-center justify-center px-2 py-1 rounded-md text-surface-800 dark:text-white bg-surface-200 dark:bg-surface-600'}
            }"
          />
        </template>
      </Column>
      <Column
        field="tracking.created"
        :header="$t('pages.projects.overview.table.columns.created')"
        :sortable="true"
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

