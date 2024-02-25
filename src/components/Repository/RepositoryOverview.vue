<script setup lang="ts">
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import OverlayPanel from "primevue/overlaypanel";
import Skeleton from "primevue/skeleton";
import Chip from "primevue/chip";
import { FilterMatchMode } from "primevue/api";

import InputText from "primevue/inputtext";

import { useCustomFetch } from "@/composables/useCustomFetch";

const containers = ref();
const router = useRouter();

async function listContainers() {
  useCustomFetch(
    "/repository/container/list",
  )
    .json()
    .then((response) => {
      containers.value = response.data.value;
    })
}

await listContainers();

async function createContainer() {
  const payload = {
    name: newContainerName.value,
  };
  useCustomFetch(
    `/repository/container/create`,
  )
    .post(payload)
    .json()
    .then((_) => {
      listContainers();
      newContainerName.value = null;
      toggleCreateContainerPanel(new Event("false"));
    });
}

async function deleteContainers() {
  for (const container of selectedContainers.value) {
    await deleteContainer(container.id);
  }
}
async function deleteContainer(id: string) {
  useCustomFetch(`/repository/container/remove?id=${id}`).then(() => {
    updateSelection(id, false);
    listContainers();
  });
}

function updateSelection(selectedContainer: string, add: boolean) {
  const container = containers.value.find((entry) => {
    return entry.id === selectedContainer;
  });
  if (!add && selectedContainers.value.indexOf(container) != -1) {
    selectedContainers.value.splice(
      selectedContainers.value.indexOf(container),
      1,
    );
  } else if (add) {
    selectedContainers.value.push(container);
  }
}

const newContainerName = ref();
const createContainerPanel = ref();
const toggleCreateContainerPanel = (event: Event) => {
  createContainerPanel.value.toggle(event);
};

const actionMenu = ref();
const toggle = (event: Event) => {
  actionMenu.value.toggle(event);
};

const actionMenuItems = ref([
  {
    label: "Actions",
    items: [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          console.log("edit");
        },
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: (event) => {
          console.log(event);
          deleteContainer();
        },
      },
    ],
  },
]);

const selectedContainers = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function newContainer() {}
function confirmDeleteSelected() {}

function openEditDialog(node) {
  console.log(node)
}

function openContainer(containerId: string, containerName: string) {
  router.push({
    name: "Container",
    query: { id: containerId, name: containerName },
  });
}
const layout = ref("grid");
</script>
<template>
  <div class="bg-surface-0 p-4 dark:bg-surface-800 @container/content">
      <DataView
        class="bg-surface-50 dark:bg-surface-700"
        :value="containers"
        :layout="layout"
      >
        <template #header>
          <Toolbar>
            <template #start>
              <Button
                label="Create"
                icon="pi pi-plus"
                severity="success"
                class="mr-2"
                @click="toggleCreateContainerPanel"
              />
              <OverlayPanel ref="createContainerPanel">
                <div class="flex space-x-1">
                  <InputText v-model="newContainerName" />
                  <Button
                    icon="pi pi-check"
                    severity="success"
                    class="mr-2 w-fit"
                    @click="createContainer"
                  />
                </div>
              </OverlayPanel>
              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                :disabled="!selectedContainers || !selectedContainers.length"
                @click="deleteContainers"
              />
            </template>
            <template #end>
              <DataViewLayoutOptions v-model="layout" />
            </template>
          </Toolbar>
        </template>

        <template #list="slotProps">
          <DataTable
            ref="containerDataTable"
            v-model:selection="selectedContainers"
            :value="slotProps.items"
            :filters="filters"
            lazy
            :paginator="true"
            :rows="5"
            :rows-per-page-options="[5, 10, 20, 50]"
            table-style="min-width: 50rem"
          >
            <template #header>
              <div class="grid grid-cols-2 justify-between gap-2">
                <h4 class="m-0">Manage Containers</h4>
                <span class="relative justify-self-end">
                <i
                  class="pi pi-search absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600"
                />
                <InputText
                  v-model="filters['global'].value"
                  class="pl-10"
                  placeholder="Search..."
                />
              </span>
              </div>
            </template>
            <Column
              selection-mode="multiple"
              style="width: 3rem"
              :exportable="false"
            ></Column>
            <Column field="name" header="Name" sortable>
              <template #loading>
                <div
                  class="align-items-center flex"
                  :style="{
                  height: '17px',
                  'flex-grow': '1',
                  overflow: 'hidden',
                }"
                >
                  <Skeleton width="60%" height="1rem" />
                </div>
              </template>
            </Column>
            <Column field="description" header="Description">
              <template #loading>
                <div
                  class="align-items-center flex"
                  :style="{
                  height: '17px',
                  'flex-grow': '1',
                  overflow: 'hidden',
                }"
                >
                  <Skeleton width="60%" height="1rem" />
                </div>
              </template>
            </Column>
            <Column field="keywords" header="Keywords">
              <template #loading>
                <div
                  class="align-items-center flex"
                  :style="{
                  height: '17px',
                  'flex-grow': '1',
                  overflow: 'hidden',
                }"
                >
                  <Skeleton width="60%" height="1rem" />
                </div>
              </template>
              <template #body="slotProps">
                <Chip v-for="keyword of slotProps.data.keywords" :key="keyword">{{
                    keyword
                  }}</Chip>
              </template>
            </Column>
            <Column field="actions">
              <template #loading>
                <div
                  class="align-items-center flex"
                  :style="{
                  height: '17px',
                  'flex-grow': '1',
                  overflow: 'hidden',
                }"
                >
                  <Skeleton width="60%" height="1rem" />
                </div>
              </template>
              <template #body="slotProps">
                <div class="flex space-x-2">
                  <button
                    class="bg-primary-300 p-2 text-surface-50 hover:bg-primary-500"
                    @click="openContainer(slotProps.data.id, slotProps.data.name)"
                  >
                    Open
                  </button>
                  <button
                    class="bg-primary-300 p-2 text-surface-50 hover:bg-primary-500"
                    @click="openEditDialog(slotProps.data.id)"
                  >
                    Edit
                  </button>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>

        <template #grid="slotProps">
          <div
            class="grid grid-cols-1 @[550px]/content:grid-cols-2 @[800px]/content:grid-cols-3 @[1050px]/content:grid-cols-4 justify-between gap-x-2 gap-y-3"
          >
              <div
                v-for="(item, index) in slotProps.items"
                :key="item.id">
                <ContainerCard
                  :id="item.id"
                  :title="item.name"
                  :description="item.description"
                  :keywords="item.keywords"
                  @refresh="listContainers"
                  @update-selection="updateSelection"
                />
              </div>
          </div>
        </template>
      </DataView>
  </div>
</template>
<style scoped></style>
