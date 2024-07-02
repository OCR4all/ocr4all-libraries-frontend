<script setup lang="ts">
import { useDialog } from "primevue/usedialog";
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import { FilterMatchMode } from "@primevue/core/api";

const router = useRouter()

const createDatasetDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Repository/Datasets/Dialog/CreateDataset.vue"
      ),
);
const editDatasetDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Repository/Datasets/Dialog/EditDataset.vue"
      ),
);
const deleteDatasetDialog = defineAsyncComponent(
  () =>
    import(
      "@/components/Repository/Datasets/Dialog/DeleteDataset.vue"
      ),
);

const rowClass = (data) => {
  return ["cursor-pointer"];
};

const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const dialog = useDialog();

const isRefetching = ref(false);
const datasets = ref();
const selectedDatasets = ref();

async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(`/data/collection/list`)
    .get()
    .json();
  datasets.value = data.value;
  setTimeout(function () {
    isRefetching.value = isFetching.value;
  }, 500);
}

await refetch()

const items = ref()
const menu = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openEditDialog(data)
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {},
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

function openDataset(id, name){
  router.push({
    name: "Dataset",
    query: { id: id, name: name },
  });
}

function openDeleteDialog() {
  dialog.open(deleteDatasetDialog, {
    props: {
      header: "Delete Dataset",
      modal: true,
    },
    onClose: () => {
      refetch()
    },
  });
}

function openCreateDialog() {
  dialog.open(createDatasetDialog, {
    props: {
      header: "Create Dataset",
      modal: true,
    },
    onClose: () => {
      refetch()
    },
  });
}

function openEditDialog(data) {
  dialog.open(editDatasetDialog, {
    props: {
      header: "Edit Dataset",
      modal: true,
    },
    data: {
      data,
    },
    onClose: () => {
      refetch()
    },
  });
}
</script>
<template>
  <Toast />
  <Menu ref="menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <a
        v-ripple
        class="flex items-center group"
        :class="{
          'rounded-md hover:bg-red-500 hover:text-white':
            item.label === 'Delete',
        }"
        v-bind="props.action"
      >
        <span
          :class="[item.icon, { 'text-red-500 group-hover:text-white':
            item.label === 'Delete'}]" />
        <span
          :class="{
          'text-red-500 group-hover:text-white':
            item.label === 'Delete',
        }">{{ item.label }}</span>
      </a>
    </template>
  </Menu>
  <Toolbar class="mb-4">
    <template #start>
      <div class="my-2 flex space-x-2">
        <ActionButton
          rounded
          type="primary"
          size="large"
          @click="openCreateDialog"
        >
          {{ $t("pages.repository.overview.toolbar.button.create") }}
        </ActionButton>
        <ActionButton
          rounded
          type="delete"
          size="large"
          :disabled="!selectedDatasets || !selectedDatasets.length"
          @click="openDeleteDialog"
        >
          {{ $t("pages.repository.overview.toolbar.button.delete") }}
        </ActionButton>
      </div>
    </template>
    <template #end>

    </template>
  </Toolbar>
  <DataTable
    ref="containerDataTable"
    v-model:selection="selectedDatasets"
    :value="datasets"
    :filters="filters"
    lazy
    :paginator="true"
    :rows="5"
    :rows-per-page-options="[5, 10, 20, 50]"
    :row-class="rowClass"
    :row-hover="true"
    table-style="min-width: 50rem"
    @row-click="openDataset($event.data.id, $event.data.name)"
  >
    <template #header>
      <div class="grid grid-cols-2 justify-between gap-2">
        <h4 class="m-0">
          Manage datasets
        </h4>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
        </div>
      </div>
    </template>
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
        <div class="flex space-x-1">
          <Tag v-for="keyword of slotProps.data.keywords" :key="keyword">{{
              keyword
            }}</Tag>
        </div>
      </template>
    </Column>
    <Column :exportable="false" style="min-width: 8rem">
      <template #body="{ data }">
        <div class="space-y-2">
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            text
            @click="toggle($event, data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
