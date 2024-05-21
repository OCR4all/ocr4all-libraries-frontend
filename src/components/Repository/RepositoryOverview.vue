<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";
const uiStore = useUiStore();

import { useCustomFetch } from "@/composables/useCustomFetch";

import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import OverlayPanel from "primevue/overlaypanel";
import Skeleton from "primevue/skeleton";
import Toast from "primevue/toast";
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Chips from "primevue/chips";
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

import { FilterMatchMode } from "primevue/api";

import { useToast } from "primevue/usetoast";
const toast = useToast();

import { Router } from "vue-router";
const router: Router = useRouter();

const containers = ref();

const newContainerName = ref();
const createContainerPanel = ref();

const id: Ref<string | undefined> = ref();
const name: Ref<string | undefined> = ref();
const description: Ref<string | undefined> = ref();
const keywords: Ref<string[] | undefined> = ref();

const editDialogVisible = ref(false);
const layout: Ref<"grid" | "list" | undefined> = ref(
  uiStore.repositoryDataViewLayout,
);

const containerCardRefs: Ref<HTMLElement[]> = ref([]);

const setContainerCardsRef = (ref) => {
  if (ref) {
    containerCardRefs.value.push(ref);
  }
};

async function listContainers() {
  useCustomFetch("/repository/container/list")
    .json()
    .then((response) => {
      containers.value = response.data.value;
    });
}

await listContainers();

async function createContainer() {
  const payload = {
    name: newContainerName.value,
  };
  useCustomFetch(`/repository/container/create`)
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
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Containers deleted",
    life: 3000,
  });
  toggleDeleteDialog();
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

const toggleCreateContainerPanel = (event: Event) => {
  createContainerPanel.value.toggle(event);
};

const selectedContainers: Ref<object[]> = ref([]);
const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const deleteDialogVisible = ref(false);
function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
}

async function updateContainer() {
  const payload = {
    name: name.value,
    keywords: keywords.value ? Array.from(keywords.value) : [],
    description: description.value,
  };
  const { isFetching, error, data } = await useCustomFetch(
    `/repository/container/update?id=${id.value}`,
  )
    .post(payload)
    .json();
  listContainers();
  editDialogVisible.value = false;
  if (!error.value) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Container updated",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Couldn't update container",
      life: 3000,
    });
  }
}

function openEditDialog(node) {
  id.value = node.id;
  name.value = node.name;
  description.value = node.description;
  keywords.value = node.keywords;

  editDialogVisible.value = true;
}

function openContainer(containerId: string, containerName: string) {
  router.push({
    name: "Container",
    query: { id: containerId, name: containerName },
  });
}

function updateDataViewLayout(event) {
  uiStore.repositoryDataViewLayout = event;
  if (event === "grid") {
    console.log(containerCardRefs.value);
    for (const container of selectedContainers.value) {
      console.log(container);
    }
  }
}
</script>
<template>
  <Toast />
  <Dialog
    v-model:visible="editDialogVisible"
    modal
    header="Edit"
    :style="{ width: '50vw' }"
  >
    <div class="mx-auto grid grid-cols-6 gap-4">
      <div class="col-span-3 flex flex-col">
        <label
          for="text"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
          >Label</label
        >
        <InputText v-model="name" type="text" />
      </div>

      <div class="col-span-4 flex flex-col">
        <label
          for="description"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-white sm:text-base"
          >{{
            $t("pages.projects.project.information.form.description")
          }}</label
        >
        <Textarea v-model="description" rows="5" cols="30" />
      </div>

      <div class="col-span-6 flex flex-col">
        <div class="col-span-4 flex flex-col">
          <label
            for="keywords"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-white sm:text-base"
            >{{ $t("pages.projects.project.information.form.keywords") }}</label
          >
          <Chips v-model="keywords" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="editDialogVisible = false"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        autofocus
        @click="updateContainer"
      />
    </template>
  </Dialog>
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Delete Containers"
    :style="{ width: '50vw' }"
  >
    <p class="pb-5 dark:text-surface-200">
      Do you really want to delete the selected containers?
    </p>
    <button
      type="button"
      class="mb-2 mr-2 rounded-md border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
      @click="toggleDeleteDialog"
    >
      Cancel
    </button>
    <button
      type="button"
      class="mb-2 mr-2 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      @click="deleteContainers"
    >
      Delete
    </button>
  </Dialog>
  <TabView>
    <TabPanel header="Images">
      <Toolbar class="mb-4">
        <template #start>
          <div class="my-2 flex space-x-2">
            <ActionButton
              rounded
              type="primary"
              size="large"
              @click="toggleCreateContainerPanel"
            >
              {{ $t("pages.repository.overview.toolbar.button.create") }}
            </ActionButton>
            <OverlayPanel ref="createContainerPanel">
              <div class="flex space-x-1">
                <InputText v-model="newContainerName" />
                <Button
                  icon="pi pi-check"
                  severity="info"
                  class="mr-2 w-fit"
                  @click="createContainer"
                />
              </div>
            </OverlayPanel>
            <ActionButton
              rounded
              type="delete"
              size="large"
              :disabled="!selectedContainers || !selectedContainers.length"
              @click="toggleDeleteDialog"
            >
              {{ $t("pages.repository.overview.toolbar.button.delete") }}
            </ActionButton>
          </div>
        </template>
        <template #end>
          <DataViewLayoutOptions
            @update:modelValue="updateDataViewLayout"
            v-model="layout"
          />
        </template>
      </Toolbar>
      <div
        class="rounded-md bg-surface-0 @container/content dark:bg-surface-800"
      >
        <DataView
          class="bg-surface-50 dark:bg-surface-700"
          :value="containers"
          :layout="layout"
        >
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
                  <h4 class="m-0">
                    {{ $t("pages.repository.overview.dataview.list.header") }}
                  </h4>
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
              <Column
                field="name"
                :header="
                $t('pages.repository.overview.dataview.list.column.name')
              "
                sortable
              >
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
              <Column
                field="description"
                :header="
                $t(
                  'pages.repository.overview.dataview.list.column.description',
                )
              "
              >
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
              <Column
                field="keywords"
                :header="
                $t('pages.repository.overview.dataview.list.column.keywords')
              "
              >
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
                  <Chip
                    v-for="keyword of slotProps.data.keywords"
                    :key="keyword"
                  >{{ keyword }}</Chip
                  >
                </template>
              </Column>
              <Column
                field="actions"
                :header="
                $t('pages.repository.overview.dataview.list.column.actions')
              "
              >
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
                    <ActionButton
                      type="primary"
                      size="small"
                      rounded
                      @click="
                      openContainer(slotProps.data.id, slotProps.data.name)
                    "
                    >
                      {{
                        $t(
                          "pages.repository.overview.dataview.list.action.open",
                        )
                      }}
                    </ActionButton>
                    <ActionButton
                      type="primary"
                      size="small"
                      rounded
                      @click="openEditDialog(slotProps.data)"
                    >
                      {{
                        $t(
                          "pages.repository.overview.dataview.list.action.edit",
                        )
                      }}
                    </ActionButton>
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>

          <template #grid="slotProps">
            <div
              class="grid grid-cols-1 justify-between gap-x-2 gap-y-3 @[550px]/content:grid-cols-2 @[800px]/content:grid-cols-3 @[1050px]/content:grid-cols-4"
            >
              <div v-for="(item, index) in slotProps.items" :key="item.id">
                <ContainerCard
                  :id="item.id"
                  :ref="setContainerCardsRef"
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
    </TabPanel>
    <TabPanel header="Datasets" :disabled="true"></TabPanel>
    <TabPanel header="Models" :disabled="true"></TabPanel>
    <TabPanel header="Workflows" :disabled="true"></TabPanel>
  </TabView>
</template>
