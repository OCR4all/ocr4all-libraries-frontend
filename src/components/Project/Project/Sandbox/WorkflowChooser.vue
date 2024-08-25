<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import DataTable from "primevue/datatable";
import { UseTimeAgo } from "@vueuse/components";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { FilterMatchMode } from "@primevue/core/api";
import { Events } from "vue";

const workflows = ref([]);
const loading = ref(true);
const isRefetching = ref(true);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

async function refetch() {
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

const selectedWorkflow = ref();

refetch();
</script>
<template>
  <DataTable
    :value="workflows"
    :paginator="true"
    :rows="10"
    v-model:selection="selectedWorkflow"
    selectionMode="single"
    :loading="loading"
    :filters="filters"
    context-menu
    :globalFilterFields="['label', 'description']"
    sortField="date"
    :sortOrder="-1"
    :row-hover="true"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rows-per-page-options="[10, 25, 50]"
    responsive-layout="scroll"
  >
    <template #header>
      <div class="flex justify-between">
        <InputText
          v-model="filters['global'].value"
          :placeholder="$t('pages.workflows.table.search.placeholder')"
        />
      </div>
    </template>
    <template #empty>
      <span class="text-primary-950 dark:text-primary-50">{{
        $t("pages.workflows.table.empty")
      }}</span>
    </template>
    <template #loading>
      <DefaultSpinner />
    </template>
    <Column
      field="label"
      :header="$t('pages.workflows.table.columns.name')"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data.label }}
      </template>
    </Column>
    <Column
      field="description"
      :header="$t('pages.workflows.table.columns.description')"
    >
      <template #body="slotProps">
        <p class="max-w-xs truncate">{{ slotProps.data.description }}</p>
      </template>
    </Column>
    <Column
      field="date"
      :header="$t('pages.workflows.table.columns.updated')"
      :sortable="true"
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
</template>
