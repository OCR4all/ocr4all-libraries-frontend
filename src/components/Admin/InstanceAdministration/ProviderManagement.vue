<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useDialog } from 'primevue/usedialog';
import { FilterMatchMode } from '@primevue/core/api';
import { useUiStore } from "@/stores/ui.store";
import ComponentContainer from "@/components/Layout/ComponentContainer.vue";

const dialog = useDialog();
const journalDialog = defineAsyncComponent(() => import('@/components/Admin/InstanceAdministration/JournalDialog.vue'));

const providerItems = ref()
const providerMenu = ref()

const items = ref()
const menu = ref()

const uiStore = useUiStore()
uiStore.breadcrumb = [
  {
    label: "Administration",
    to: "/admin/dashboard"
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

const selectedProviders = ref([])

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

async function executeProviderAction(data: any, action: string){
  const promises = []
  for(const provider of data){
    const payload = {
      "id": provider.id,
      "action": action
    }

    promises.push(useCustomFetch(`/administration/provider/action`)
      .post(payload)
    )
  }

  await Promise.all(promises)
  await getProviders()
}

function toggleProviderMenu(event: Event, data: any){
  providerItems.value = [
    {
      label: 'Information',
      items: [
        {
          label: 'Journal',
          icon: 'pi pi-book',
          command: () => {
            showJournal(data)
          }
        }
      ],
    },
    {
      label: 'Actions',
      items: [
        {
          label: 'Restart',
          icon: 'pi pi-refresh',
          command: () => {
            executeProviderAction([data], "restart")
          }
        },
        {
          label: 'Start',
          icon: 'pi pi-play',
          command: () => {
            executeProviderAction([data], "start")
          }
        },
        {
          label: 'Stop',
          icon: 'pi pi-stop',
          command: () => {
            executeProviderAction([data], "stop")
          }
        }
      ]
    }
  ]
  providerMenu.value.toggle(event);
}

function toggleMenu(event){
  items.value = [
    {
      label: 'Actions',
      items: [
        {
          label: 'Restart',
          icon: 'pi pi-refresh',
          command: () => {
            executeProviderAction(selectedProviders.value, "restart")
          }
        },
        {
          label: 'Start',
          icon: 'pi pi-play',
          command: () => {
            executeProviderAction(selectedProviders.value, "start")
          }
        },
        {
          label: 'Stop',
          icon: 'pi pi-stop',
          command: () => {
            executeProviderAction(selectedProviders.value, "stop")
          }
        }
      ]
    }
  ]
  menu.value.toggle(event);
}

getProviders()
</script>
<template>
  <Menu ref="menu" :model="items" :popup="true" />
  <Menu ref="providerMenu" :model="providerItems" :popup="true" />
  <ComponentContainer>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedProviders"
      scrollable
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
            <Button icon="pi pi-refresh" text rounded @click="getProviders" />
            <Button icon="pi pi-ellipsis-v" :disabled="selectedProviders.length === 0" @click="toggleMenu($event)" text rounded aria-label="Filter" />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
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
          <div class="grid gap-0.5">
            <Tag v-for="category in data.categories" :key="category" :value="category" />
          </div>
        </template>
      </Column>
      <Column field="steps" header="Steps">
        <template #body="{ data }">
          <div class="grid gap-0.5">
            <Tag v-for="step in data.steps" :key="step" :value="step"/>
          </div>
        </template>
      </Column>
      <Column field="index" header="Index"></Column>
      <Column>
        <template #body="{ data }">
          <Button icon="pi pi-ellipsis-v" @click="toggleProviderMenu($event, data)" text rounded aria-label="Filter" />
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
<style>

</style>
