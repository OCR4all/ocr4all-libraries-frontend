<script setup lang="ts">
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Skeleton from "primevue/skeleton";
import SelectButton from "primevue/selectbutton";
import Column from "primevue/column";
import Button from "primevue/button";
import DataView from "primevue/dataview";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";

import { useCustomFetch } from "@/composables/useCustomFetch";
import { FilterMatchMode, FilterService } from "@primevue/core/api";

import IconCreate from "~icons/gridicons/create";

import { useToast } from "primevue/usetoast";
const toast = useToast();

const dialog = useDialog();

import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

import { Router } from "vue-router";
import Dialog from "primevue/dialog";
import Chips from "primevue/chips";
import Toast from "primevue/toast";
import Textarea from "primevue/textarea";
import { RemovableRef } from "@vueuse/core";
import { IContainer } from "@/components/Project/project.interfaces";
import ShareDialog from "@/components/Repository/Images/Container/Dialog/ShareDialog.vue";
import { useDialog } from "primevue/usedialog";
import ProgressSpinner from "primevue/progressspinner";

import IconActions from "~icons/fluent/more-vertical-32-regular";
import { capitalize } from "vue";

const IN_ARRAY = 'IN_ARRAY';

onBeforeMount(() => {
  FilterService.register(IN_ARRAY, (value, filter) => {
    if (filter === undefined || filter === null) {
      return true;
    }
    if (value === undefined || value === null || !Array.isArray(value)) {
      return false;
    }

    for(const keyword of filter){
      if(value.includes(keyword.keywords)) return true
    }
    return true
  });
})

const router: Router = useRouter();

const containers = ref([]);
const availableKeywords = ref();

const newContainerName = ref();
const createContainerPanel = ref();

const options = ref(["list", "grid"]);

const id: Ref<string | undefined> = ref();
const name: Ref<string | undefined> = ref();
const description: Ref<string | undefined> = ref();
const keywords: RemovableRef<string[] | undefined> = ref();

const editDialogVisible = ref(false);
const layout: RemovableRef<string> = useLocalStorage(
  "ocr4all/frontend/repository/images/layout",
  "grid",
);

const containerCardRefs: Ref<HTMLElement[]> = ref([]);

const setContainerCardsRef = (ref) => {
  if (ref) {
    containerCardRefs.value.push(ref);
  }
};

const isLoadingContainers = ref(true);
async function listContainers() {
  useCustomFetch("/repository/container/list")
    .json()
    .then((response) => {
      if (response.error.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: response.error.value,
          life: 3000,
          group: "general",
        });
      } else if (response.data.value) {
        console.log(response.data.value)
        const data: IContainer[] = response.data.value;
        containers.value = data.filter(function (container: IContainer) {
          return container.right !== null;
        });
        const keywords = [];
        for (const container of containers.value) {
          if (container.keywords) {
            keywords.push(...container.keywords);
          }
        }
        const keywordSet = new Set(keywords);
        availableKeywords.value = Array.from(keywordSet)
      }
      isLoadingContainers.value = false;
    });
}

await listContainers();

const items = ref();
const menu = ref();

const toggle = (event: Event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Open",
          icon: "pi pi-eye",
          command: () => {
            openContainer(data.id, data.name);
          },
        },
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openEditDialog(data);
          },
        },
        {
          label: "Share",
          icon: "pi pi-share-alt",
          command: () => {
            openShareModal(data);
          },
        },
        {
          label: "Download",
          icon: "pi pi-download",
          command: () => {
            downloadContainer(data);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            confirmDelete(data.id);
          },
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

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
  if (selectedContainers.value !== undefined) {
    for (const container of selectedContainers.value) {
      await deleteContainer(container.id);
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Containers deleted",
      life: 3000,
      group: "general",
    });
    toggleDeleteDialog();
  }
}

const confirmDelete = (id: string) => {
  confirm.require({
    message: "Do you want to delete this project?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    position: "bottom",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      deleteContainer(id);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Project successfully deleted.",
        life: 3000,
        group: "general",
      });
    },
    reject: () => {},
  });
};

async function deleteContainer(id: string) {
  useCustomFetch(`/repository/container/remove?id=${id}`).then(() => {
    updateSelection(id, false);
    listContainers();
  });
}

function updateSelection(selectedContainer: string, add: boolean) {
  const container = containers.value.find((entry: IContainer) => {
    return entry.id === selectedContainer;
  });
  if (
    selectedContainers.value !== undefined &&
    !add &&
    selectedContainers.value.indexOf(container) != -1
  ) {
    selectedContainers.value.splice(
      selectedContainers.value.indexOf(container),
      1,
    );
  } else if (selectedContainers.value !== undefined && add) {
    selectedContainers.value.push(container);
  }
}

const toggleCreateContainerPanel = (event: Event) => {
  createContainerPanel.value.toggle(event);
};

const selectedContainers: Ref<IContainer[] | undefined> = ref([]);

const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  keywords: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
  const { error } = await useCustomFetch(
    `/repository/container/update?id=${id.value}`,
  )
    .post(payload)
    .json();
  await listContainers();
  editDialogVisible.value = false;
  if (!error.value) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Container updated",
      life: 3000,
      group: "general",
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Couldn't update container",
      life: 3000,
      group: "general",
    });
  }
}

function openEditDialog(node: IContainer) {
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

const contextMenu = ref();
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        openContainer(event.data.id, event.data.name);
      },
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        openEditDialog(event.data);
      },
    },
    {
      label: "Share",
      icon: "pi pi-share-alt",
      command: () => {
        openShareModal(event.data);
      },
    },
    {
      label: "Download",
      icon: "pi pi-download",
      command: () => {
        downloadContainer(event.data);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDelete(event.data.id);
      },
    },
  ];
  contextMenu.value.show(event.originalEvent);
};


function getRightSeverity(right: string){
  switch(right){
    case "read":
      return "secondary"
    case "write":
      return "info"
    case "special":
      return "success"
  }
}

function openShareModal(data: IContainer) {
  dialog.open(ShareDialog, {
    props: {
      header: `Share "${data.name}"`,
      modal: true,
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    data: data,
    onClose: () => {
      listContainers();
    },
  });

}
const containerDataTable = ref()
function showFilters(event){
  console.log(event)
  console.log(containerDataTable.value)
}

const filteredContainers = computed(() => {
  return containers.value
})

function downloadContainer(container: IContainer) {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/repository/container/folio/zip/${container.id}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${container.name}.zip`);
      document.body.appendChild(link);
      link.click();
      toast.removeGroup("download-toast");
    });
}
</script>
<template>
  <ConfirmDialog />
  <Toast position="bottom-right" group="download-toast">
    <template #container="{ message, closeCallback }">
      <div
        class="backdrop-md flex w-full items-center rounded-lg bg-surface-200/50 p-4 shadow dark:bg-surface-700/50"
        role="alert"
      >
        <div
          class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center"
        >
          <ProgressSpinner
            class="h-4 w-4"
            stroke-width="8"
            fill="transparent"
            animation-duration=".5s"
            aria-label="Download Spinner"
          />
          <span class="sr-only">Fire icon</span>
        </div>
        <div
          class="ms-3 text-sm font-normal text-surface-800 dark:text-surface-100"
        >
          {{ message.summary }}
        </div>
        <button
          type="button"
          class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-surface-800 hover:bg-gray-100 hover:text-surface-950 focus:ring-2 focus:ring-surface-300 dark:text-surface-200 dark:hover:bg-gray-800 dark:hover:text-white"
          data-dismiss-target="#toast-default"
          aria-label="Close"
          @click="closeCallback"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </template>
  </Toast>
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
  <Menu ref="menu" :model="items" :popup="true">
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
  </Menu>
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
  <ComponentContainer spaced>
    <Toolbar>
      <template #start>
        <div class="flex">
          <Button
            v-tooltip.top="
              $t('pages.repository.overview.toolbar.button.create')
            "
            text
            @click="toggleCreateContainerPanel"
          >
            <IconCreate class="text-black dark:text-white" />
          </Button>
          <Popover ref="createContainerPanel">
            <div class="flex space-x-1">
              <InputText v-model="newContainerName" />
              <Button
                icon="pi pi-check"
                text
                severity="contrast"
                @click="createContainer"
              />
            </div>
          </Popover>
          <Button
            v-tooltip.top="'Import from Exchange'"
            :disabled="true"
            text
          >
            <i class="pi pi-file-import text-black dark:text-white" />
          </Button>
          <Button
            v-tooltip.top="
              $t('pages.repository.overview.toolbar.button.delete')
            "
            icon="pi pi-trash"
            :disabled="!selectedContainers || !selectedContainers.length"
            severity="danger"
            text
            @click="toggleDeleteDialog"
          />
        </div>
      </template>
      <template #center> </template>
      <template #end>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Search" />
        </IconField>
      </template>
    </Toolbar>
    <div class="flex justify-end">
      <SelectButton v-model="layout" :options="options" :allow-empty="false">
        <template #option="{ option }">
          <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-th-large']" />
        </template>
      </SelectButton>
    </div>
    <div v-if="isLoadingContainers">
      <Fluid>
        <Skeleton height="30rem" />
      </Fluid>
    </div>
    <DataView v-else :value="containers" :layout="layout">
      <template #list="slotProps">
        <DataTable
          ref="containerDataTable"
          v-model:selection="selectedContainers"
          v-model:filters="filters"
          :value="slotProps.items"
          filter-display="row"
          @filter="showFilters"
          :global-filter-fields="['name', 'description', 'keywords']"
          context-menu
          :paginator="true"
          :rows="5"
          :rows-per-page-options="[5, 10, 20, 50]"
          :row-hover="true"
          table-style="min-width: 50rem"
          @row-contextmenu="onRowContextMenu"
        >
          <Column
            selection-mode="multiple"
            style="width: 3rem"
            :exportable="false"
          ></Column>
          <Column
            field="name"
            :header="$t('pages.repository.overview.dataview.list.column.name')"
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
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                placeholder="Search by name"
                @input="filterCallback()"
              />
            </template>
            <template #body="{ data }">
              <p
                class="cursor-pointer hover:underline"
                @click="openContainer(data.id, data.name)"
              >
                {{ data.name }}
              </p>
            </template>
          </Column>
          <Column
            field="description"
            :header="
              $t('pages.repository.overview.dataview.list.column.description')
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
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                placeholder="Search by name"
                @input="filterCallback()"
              />
            </template>
          </Column>
          <Column
            field="keywords"
            sortable
            filter-field="keywords"
            :show-filter-match-modes="false"
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
              <div class="flex space-x-1">
                <Tag
                  v-for="keyword of slotProps.data.keywords"
                  :key="keyword"
                  >{{ keyword }}</Tag
                >
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <MultiSelect
                v-model="filterModel.value"
                :options="availableKeywords"
                filter
                placeholder="Any"
                @change="filterCallback"
              >
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <span>{{ slotProps.option }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column field="tracking.user" header="Owner">
            <template #body=" { data }">
              <div class="flex space-x-2 items-center">
                <AvatarInitials :name="data.tracking.user" />
                <p class="inline-block align-middle">{{ data.tracking.user }}</p>
              </div>
            </template>
          </Column>
          <Column field="right" header="Rights">
            <template #body="{ data }">
              <Tag :value="capitalize(data.right)" :severity="getRightSeverity(data.right)" />
            </template>
          </Column>
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
              <div class="space-y-2">
                <Button type="button" text @click="toggle($event, data)">
                  <IconActions class="text-surface-900 dark:text-surface-100" />
                </Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>

      <template #grid="{ items }">
        <div
          v-auto-animate
          class="grid grid-flow-row-dense grid-cols-1 justify-items-start gap-x-2 gap-y-3 @[580px]/content:grid-cols-2 @[850px]/content:grid-cols-3 @[1050px]/content:grid-cols-4 @[1400px]/content:grid-cols-5"
        >
          <ContainerCard
            v-for="item in filteredContainers"
            v-bind="item"
            :key="item.id"
            :ref="setContainerCardsRef"
            @refresh="listContainers"
            @update-selection="updateSelection"
          />
        </div>
      </template>
    </DataView>
  </ComponentContainer>
</template>
