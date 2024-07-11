<script setup lang="ts">
import DataTable from "primevue/datatable";

interface IWorkflowMetadata {
  label: string;
  description: string;
  id: string;
  date: string;
}

import { useNodeFlowStore } from "@/stores/nodeflow.store";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useDialog } from "primevue/usedialog";
import { UseTimeAgo } from "@vueuse/components";

import { FilterMatchMode } from "@primevue/core/api";

import { ArrowPathIcon } from "@heroicons/vue/24/outline";

import { Router } from "vue-router";

import { useToast } from "primevue/usetoast";

const editWorkflowDialog = defineAsyncComponent(
  () => import("@/components/Repository/Workflows/Dialog/EditDialog.vue"),
);
const deleteWorkflowDialog = defineAsyncComponent(
  () => import("@/components/Repository/Workflows/Dialog/DeleteDialog.vue"),
);

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const toast = useToast();
const dialog = useDialog();

const store = useNodeFlowStore();

const router: Router = useRouter();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const labelTaken: Ref<boolean> = ref(false);
const originalWorkflowName: Ref<string | undefined> = ref();
const workflowMetadata: Ref<IWorkflowMetadata> = ref();

const menu = ref();
const items = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Open",
          icon: "pi pi-eye",
          command: () => {
            loadWorkflow(data)
          }
        },
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openEditDialog(data);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            openDeleteDialog(data);
          },
        },
      ],
    },
  ];
  menu.value.toggle(event);
};
const contextMenu = ref();
const onRowContextMenu = (event) => {
  items.value = [
    {
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        loadWorkflow(event.data)
      }
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        openEditDialog(event.data);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        openDeleteDialog(event.data);
      },
    },
  ];
  contextMenu.value.toggle(event.originalEvent);
};

const loading = ref(true);
const isRefetching = ref(false);
const workflows = ref([]);

async function refetch() {
  isRefetching.value = true;
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

function openDeleteDialog(data) {
  dialog.open(deleteWorkflowDialog, {
    props: {
      header: "Delete Workflow",
      modal: true,
    },
    data: {
      data,
    },
    onClose: () => {
      refetch();
    },
  });
}

function openEditDialog(data) {
  dialog.open(editWorkflowDialog, {
    props: {
      header: "Edit Workflow",
      modal: true,
    },
    data: data,
    onClose: () => {
      refetch();
    },
  });
}

async function updateWorkflow() {
  const workflowListData = await useCustomFetch(
    `${import.meta.env.VITE_API_URL}/workflow/list`,
  )
    .get()
    .json();
  if (
    workflowListData.data.value.filter(
      (entry) => entry.label === workflowMetadata.value.label,
    ).length > 0 &&
    originalWorkflowName.value != workflowMetadata.value.label
  ) {
    labelTaken.value = true;
  } else {
    const payload = {
      label: workflowMetadata.value.label,
      description: workflowMetadata.value.description,
    };
    const { error } = await useCustomFetch(
      `/workflow/update/${workflowMetadata.value.id}`,
    )
      .post(payload)
      .json();
    if (error.value) {
      toast.add({
        severity: "error",
        summary: t("pages.workflows.toasts.update.error.summary"),
        detail: t("pages.workflows.toasts.update.error.detail"),
        life: 3000,
      });
    } else {
      toast.add({
        severity: "success",
        summary: t("pages.workflows.toasts.update.success.summary"),
        detail: t("pages.workflows.toasts.update.success.detail"),
        life: 3000,
      });
    }
    refetch();
  }
}

function loadWorkflow(data) {
  store.graphId = data.id;
  store.graphLabel = data.label;
  router.push("/nodeflow");
}

refetch();
</script>
<template>
  <Toast />
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
  <Toolbar class="mb-4">
    <template #start>
      <div class="my-2 space-x-2">
        <ActionButton
          rounded
          type="primary"
          size="large"
          @click="router.push('/nodeflow')"
        >
          {{ $t("pages.workflows.toolbar.new") }}
        </ActionButton>
      </div>
    </template>
  </Toolbar>
  <ComponentContainer>
    <DataTable
      :value="workflows"
      :paginator="true"
      :rows="10"
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
      @row-contextmenu="onRowContextMenu"
    >
      <template #header>
        <div class="flex justify-between">
          <h4 class="m-0 font-bold self-center">
            {{ $t("pages.workflows.table.heading") }}
          </h4>
          <span class="p-input-icon-left ml-10">
            <button :disabled="isRefetching === true" @click="refetch">
              <ArrowPathIcon
                :class="{ 'animate-spin': isRefetching }"
                class="mr-2 inline h-6 w-6 text-surface-800 hover:text-black dark:text-surface-200 dark:hover:text-white"
              />
            </button>
            <InputText
              v-model="filters['global'].value"
              :placeholder="$t('pages.workflows.table.search.placeholder')"
            />
          </span>
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
          <p
            class="cursor-pointer hover:underline"
            @click="loadWorkflow(data)"
          >
            {{ data.label }}
          </p>
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
      <Column :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="space-y-2">
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              text
              severity="secondary"
              @click="toggle($event, data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
