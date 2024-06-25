<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useDialog } from 'primevue/usedialog';
import { FilterMatchMode } from '@primevue/core/api';
import { useUiStore } from "@/stores/ui.store";

const dialog = useDialog();
const journalDialog = defineAsyncComponent(() => import('@/components/Admin/InstanceAdministration/JournalDialog.vue'));

const uiStore = useUiStore()
uiStore.breadcrumb = [
  {
    label: "Administration",
  },
  {
    label: "Providers"
  }
]

const nodes = ref()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  provider: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
  steps: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

async function getProviders() {
  useCustomFetch(`/administration/provider/overview`)
    .json()
    .then((response) => {
      const providers = []
      for(const [category, value] of Object.entries(response.data.value)){
        for(const provider of value){
          provider.category = category
          providers.push(provider)
        }
      }
      nodes.value = providers
    });
}

function showJournal(data){
  dialog.open(journalDialog, {
    data: {
      journal: data.journal
    },
    props: {
      header: data.name,
      modal: true
    },
  });
}

async function toggleEnabled(data) {
  const action = data.enabled ? "disable" : "enable"
  const payload = {
    "id": data.id,
    "action": action
  }
  await useCustomFetch(`/administration/provider/action`)
    .post(payload)
  await getProviders()
}

async function toggleEager(data){
  const action = data["eager-initialized"] ? "lazy" : "eager"
  const payload = {
    "id": data.id,
    "action": action
  }
  await useCustomFetch(`/administration/provider/action`)
    .post(payload)
  await getProviders()
}

getProviders()
</script>
<template>
    <DataTable
      v-model:filters="filters"
      scrollable
      scroll-height="50vh"
      striped-rows
      :value="nodes"
      :global-filter-fields="['name', 'provider', 'description', 'categories', 'steps']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20, 50]">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Providers</span>
          <div class="flex gap-2">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search" />
            </IconField>
            <Button icon="pi pi-refresh" rounded raised @click="getProviders" />
          </div>
        </div>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="provider" header="Provider"></Column>
      <Column field="enabled" sortable header="Enabled">
        <template #body="{ data }">
          <i class="pi" :class="{ 'pi-check-circle text-green-500 hover:cursor-pointer': data.enabled, 'pi-times-circle text-red-400 hover:cursor-pointer': !data.enabled }" @click="toggleEnabled(data)"></i>
        </template>
      </Column>
      <Column field="eager-initialized" sortable  header="Eager">
        <template #body="{ data }">
          <i class="pi" :class="{ 'pi-check-circle text-green-500 hover:cursor-pointer': data['eager-initialized'], 'pi-times-circle text-red-400 hover:cursor-pointer': !data['eager-initialized'] }" @click="toggleEager(data)"></i>
        </template>
      </Column>
      <Column field="status" header="Status"></Column>
      <Column field="version" header="Version"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="categories" header="Categories">
        <template #body="{ data }">
          <Tag v-for="category in data.categories" :key="category" :value="category" />
        </template>
      </Column>
      <Column field="steps" header="Steps">
        <template #body="{ data }">
          <Tag v-for="step in data.steps" :key="step" :value="step" />
        </template>
      </Column>
      <Column field="index" header="Index"></Column>
      <Column field="journal" header="Journal">
        <template #body="{ data }">
          <Button @click="showJournal(data)">Show</Button>
        </template>
      </Column>
    </DataTable>
</template>
<style>

</style>
