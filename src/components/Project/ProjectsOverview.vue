<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

import { ArrowPathIcon } from "@heroicons/vue/24/outline";

import { UseTimeAgo } from "@vueuse/components";

import { useCustomFetch } from "@/composables/useCustomFetch";
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

const rowClass = (data) => {
  return ["cursor-pointer"];
};

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

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Projects",
    to: "/project/overview",
  },
];

refetch();
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
    <ComponentContainer>
      <DataTable
        v-model:filters="filters"
        :value="projects"
        :paginator="true"
        :rows="10"
        :loading="loading"
        scrollable
        filter-display="row"
        :global-filter-fields="['name', 'state', 'keywords']"
        sort-field="tracking.updated"
        :sort-order="-1"
        :row-class="rowClass"
        :row-hover="true"
        @row-click="router.push(`/project/${$event.data.id}/view`)"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #header>
          <div class="grid grid-cols-1 sm:grid-cols-2 items-center justify-items-start sm:justify-items-between gap-2">
            <h4 class="m-0 font-bold">
              {{ $t("pages.projects.overview.table.header") }}
            </h4>
            <div class="flex justify-self-start sm:justify-self-end">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" :placeholder="$t('pages.projects.overview.table.search.placeholder')" />
              </IconField>
            </div>
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
            <p class="max-w-[10rem] truncate">
              {{ slotProps.data.description }}
            </p>
          </template>
        </Column>
        <Column
          field="state"
          :header="$t('pages.projects.overview.table.columns.state')"
          :filter-menu-style="{ width: '14rem' }"
        >
          <template #body="{ data }">
            <Tag :value="data.state" :severity="getSeverity(data.state)" />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown
              v-model="filterModel.value"
              :options="states"
              placeholder="Select State"
              class="p-column-filter"
              style="min-width: 5rem; max-width: 12rem"
              :show-clear="true"
              @change="filterCallback()"
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
            <div class="flex gap-1">
              <Tag
                v-for="keyword in slotProps.data.keywords"
                :key="keyword.name"
                :value="keyword"
                :pt="{
                  root: {
                    class:
                      'text-xs font-bold bg-surface-200 inline-flex items-center justify-center px-2 py-1 rounded-md text-surface-800 dark:text-white bg-surface-200 dark:bg-surface-600',
                  },
                }"
              />
            </div>
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
    </ComponentContainer>
  </div>
</template>
