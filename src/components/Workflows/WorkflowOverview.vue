<script setup lang="ts">
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
  () => import("@/components/Workflows/Dialog/EditDialog.vue"),
);
const deleteWorkflowDialog = defineAsyncComponent(
  () => import("@/components/Workflows/Dialog/DeleteDialog.vue"),
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
const workflowView = ref();

const menu = ref();
const items = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {},
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

function openDeleteDialog() {
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

function openEditDialog() {
  dialog.open(editWorkflowDialog, {
    props: {
      header: "Edit Workflow",
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
    editDialogVisible.value = false;
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
  <Menu ref="menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <a
        v-ripple
        class="flex items-center"
        :class="{
          'rounded-md hover:bg-red-500 hover:text-white':
            item.label === 'Delete',
        }"
        v-bind="props.action"
      >
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>
  <Toolbar class="mb-4">
    <template #start>
      <div class="my-2 space-x-2">
        <button
          type="button"
          class="rounded-md bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          @click="router.push('/nodeflow')"
        >
          {{ $t("pages.workflows.toolbar.new") }}
        </button>
      </div>
    </template>

    <template #end>
      <button :disabled="isRefetching === true" @click="refetch">
        <ArrowPathIcon
          :class="{ 'animate-spin': isRefetching }"
          class="mr-2 inline h-6 w-6 text-surface-800 hover:text-black dark:text-surface-200 dark:hover:text-white"
        />
      </button>
    </template>
  </Toolbar>
  <ComponentContainer>
    <DataTable
      :value="workflows"
      :paginator="true"
      :rows="10"
      :loading="loading"
      :filters="filters"
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
          <h2 class="my-4 text-xl">
            {{ $t("pages.workflows.table.heading") }}
          </h2>
          <span class="p-input-icon-left ml-10">
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
      <Column :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <div class="space-y-2">
            <button
              type="button"
              class="mr-2 inline-flex items-center rounded-md bg-blue-600 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="loadWorkflow(slotProps.data)"
            >
              {{ $t("pages.workflows.table.columns.open") }}
            </button>
          </div>
        </template>
      </Column>
      <Column
        field="label"
        :header="$t('pages.workflows.table.columns.name')"
        :sortable="true"
      ></Column>
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
              @click="toggle($event, data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
