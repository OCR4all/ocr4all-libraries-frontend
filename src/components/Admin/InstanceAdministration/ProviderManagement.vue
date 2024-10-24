<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useDialog } from "primevue/usedialog";
import { FilterMatchMode } from "@primevue/core/api";
import { useUiStore } from "@/stores/ui.store";
import ComponentContainer from "@/components/Layout/ComponentContainer.vue";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";

const dialog = useDialog();
const journalDialog = defineAsyncComponent(
  () => import("@/components/Admin/InstanceAdministration/JournalDialog.vue"),
);

const providerItems = ref();
const providerMenu = ref();

const items = ref();
const menu = ref();

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Administration",
    to: "/admin/dashboard",
  },
  {
    label: "Providers",
  },
];

useHead({
  title: "Providers",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

const nodes = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  provider: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
  steps: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedProviders = ref([]);

const isLoadingProviders = ref(true);

async function getProviders() {
  useCustomFetch(`/administration/provider/overview`)
    .json()
    .then((response) => {
      const providers = [];
      for (const [category, value] of Object.entries(response.data.value)) {
        for (const provider of value) {
          provider.category = category;
          providers.push(provider);
        }
      }
      nodes.value = providers;
      isLoadingProviders.value = false;
    });
}

function showJournal(data) {
  dialog.open(journalDialog, {
    data: {
      journal: data.journal,
    },
    props: {
      header: data.name,
      modal: true,
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
  });
}

async function toggleEnabled(data) {
  const action = data.enabled ? "disable" : "enable";
  const payload = {
    id: data.id,
    action: action,
  };
  await useCustomFetch(`/administration/provider/action`).post(payload);
  await getProviders();
}

async function toggleEager(data) {
  const action = data["eager-initialized"] ? "lazy" : "eager";
  const payload = {
    id: data.id,
    action: action,
  };
  await useCustomFetch(`/administration/provider/action`).post(payload);
  await getProviders();
}

async function executeProviderAction(data: any, action: string) {
  const promises = [];
  for (const provider of data) {
    const payload = {
      id: provider.id,
      action: action,
    };

    promises.push(
      useCustomFetch(`/administration/provider/action`).post(payload),
    );
  }

  await Promise.all(promises);
  await getProviders();
}

function toggleProviderMenu(event: Event, data: any) {
  providerItems.value = [
    {
      label: "Information",
      items: [
        {
          label: "Journal",
          icon: "pi pi-book",
          command: () => {
            showJournal(data);
          },
        },
      ],
    },
    {
      label: "Actions",
      items: [
        {
          label: "Restart",
          icon: "pi pi-refresh",
          command: () => {
            executeProviderAction([data], "restart");
          },
        },
        {
          label: "Start",
          icon: "pi pi-play",
          command: () => {
            executeProviderAction([data], "start");
          },
        },
        {
          label: "Stop",
          icon: "pi pi-stop",
          command: () => {
            executeProviderAction([data], "stop");
          },
        },
      ],
    },
  ];
  providerMenu.value.toggle(event);
}

const contextMenu = ref();
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Journal",
      icon: "pi pi-book",
      command: () => {
        showJournal(event.data);
      },
    },
    {
      label: "Restart",
      icon: "pi pi-refresh",
      command: () => {
        executeProviderAction([event.data], "restart");
      },
    },
    {
      label: "Start",
      icon: "pi pi-play",
      command: () => {
        executeProviderAction([event.data], "start");
      },
    },
    {
      label: "Stop",
      icon: "pi pi-stop",
      command: () => {
        executeProviderAction([event.data], "stop");
      },
    },
  ];
  contextMenu.value.show(event.originalEvent);
};

getProviders();
</script>
<template>
  <Menu ref="menu" :model="items" :popup="true" />
  <Menu ref="providerMenu" :model="providerItems" :popup="true" />
  <ContextMenu ref="contextMenu" :model="items">
    <template #item="{ item, props }">
      <a
        v-ripple
        class="group flex items-center"
        :class="{
          'rounded-md hover:bg-red-500 hover:text-white':
            item.label === 'Delete',
        }"
        v-bind="props.action"
      >
        <span
          :class="[
            item.icon,
            { 'text-red-500 group-hover:text-white': item.label === 'Delete' },
          ]"
        />
        <span
          :class="{
            'text-red-500 group-hover:text-white': item.label === 'Delete',
          }"
          >{{ item.label }}</span
        >
      </a>
    </template>
  </ContextMenu>
  <ComponentContainer spaced>
    <Toolbar>
      <template #start>
        <Button
          v-tooltip.top="'Restart'"
          severity="contrast"
          :disabled="selectedProviders.length === 0"
          text
          @click="executeProviderAction(selectedProviders, 'restart')"
        >
          <i class="pi pi-refresh text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Start'"
          severity="contrast"
          :disabled="selectedProviders.length === 0"
          text
          @click="executeProviderAction(selectedProviders, 'start')"
        >
          <i class="pi pi-play text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="'Stop'"
          severity="contrast"
          :disabled="selectedProviders.length === 0"
          text
          @click="executeProviderAction(selectedProviders, 'stop')"
        >
          <i class="pi pi-stop text-black dark:text-white" />
        </Button>
      </template>
      <template #end>
        <Button
          icon="pi pi-refresh text-black dark:text-white"
          text
          rounded
          @click="getProviders"
        />
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Search" />
        </IconField>
      </template>
    </Toolbar>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedProviders"
      :loading="isLoadingProviders"
      scrollable
      striped-rows
      resizableColumns
      columnResizeMode="expand"
      :value="nodes"
      @row-contextmenu="onRowContextMenu"
      :global-filter-fields="[
        'name',
        'provider',
        'description',
        'categories',
        'steps',
      ]"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20, 50]"
    >
      <Column selection-mode="multiple" header-style="width: 3rem"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="provider" header="Provider"></Column>
      <Column field="enabled" sortable header="Enabled">
        <template #body="{ data }">
          <i
            class="pi"
            :class="{
              'pi-check-circle text-green-500 hover:cursor-pointer':
                data.enabled,
              'pi-times-circle text-red-400 hover:cursor-pointer':
                !data.enabled,
            }"
            @click="toggleEnabled(data)"
          ></i>
        </template>
      </Column>
      <Column field="eager-initialized" sortable header="Eager">
        <template #body="{ data }">
          <i
            class="pi"
            :class="{
              'pi-check-circle text-green-500 hover:cursor-pointer':
                data['eager-initialized'],
              'pi-times-circle text-red-400 hover:cursor-pointer':
                !data['eager-initialized'],
            }"
            @click="toggleEager(data)"
          ></i>
        </template>
      </Column>
      <Column field="status" header="Status"></Column>
      <Column field="version" header="Version"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="categories" header="Categories">
        <template #body="{ data }">
          <div class="grid gap-0.5">
            <Tag
              v-for="category in data.categories"
              :key="category"
              :value="category"
            />
          </div>
        </template>
      </Column>
      <Column field="steps" header="Steps">
        <template #body="{ data }">
          <div class="grid gap-0.5">
            <Tag v-for="step in data.steps" :key="step" :value="step" />
          </div>
        </template>
      </Column>
      <Column field="index" header="Index"></Column>
      <Column>
        <template #body="{ data }">
          <Button
            icon="pi pi-ellipsis-v"
            class="text-black dark:text-white"
            severity="contrast"
            text
            rounded
            aria-label="Filter"
            @click="toggleProviderMenu($event, data)"
          />
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
<style></style>
