<script setup lang="ts">
import { ArrowPathIcon, EyeIcon, PencilIcon } from "@heroicons/vue/24/outline";

import { UseTimeAgo } from "@vueuse/components";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import InlineMessage from "primevue/inlinemessage";
import Textarea from "primevue/textarea";
import { FilterMatchMode } from "primevue/api";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useToast } from "primevue/usetoast";
const toast = useToast();

const store = useNodeFlowStore();

import { useNodeFlowStore } from "@/stores/nodeflow.store";
import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();

const editDialogVisible = ref(false);
const deleteDialogVisible = ref(false);

const labelTaken = ref(false);
const originalWorkflowName = ref();
const workflowMetadata = ref();
const workflowView = ref();

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

refetch();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function toggleEditDialog() {
  editDialogVisible.value = !editDialogVisible.value;
}

async function editWorkflow(id) {
  const { error, data } = await useCustomFetch(`/workflow/pull/${id}`)
    .get()
    .json();
  if (error.value) {
    toast.add({
      severity: "error",
      summary: t("pages.workflows.toasts.update.error.summary"),
      detail: t("pages.workflows.toasts.update.error.detail"),
      life: 3000,
    });
  } else {
    originalWorkflowName.value = data.value.metadata.label;
    workflowMetadata.value = data.value.metadata;
    workflowView.value = data.value.view;
    toggleEditDialog();
  }
}

function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
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

async function deleteWorkflow() {
  const { data } = await useCustomFetch(
    `/workflow/remove/${workflowMetadata.value.id}`,
  )
    .get()
    .json();
  toggleDeleteDialog();
  toggleEditDialog();
  toast.add({
    severity: "success",
    summary: t("pages.workflows.toasts.remove.success.summary"),
    detail: t("pages.workflows.toasts.remove.success.detail"),
    life: 3000,
  });
  refetch();
}
</script>
<template>
  <Toast />
  <div class="card">
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
      <Column
        :exportable="false"
        style="min-width: 8rem"
      >
        <template #body="slotProps">
          <div class="space-y-2">
            <button
              type="button"
              class="mr-2 inline-flex items-center rounded-md bg-blue-600 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="loadWorkflow(slotProps.data)"
            >
              {{ $t('pages.workflows.table.columns.open') }}
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
      <Column
        :header="$t('pages.workflows.table.columns.actions')"
        :exportable="false"
        style="min-width: 8rem"
      >
        <template #body="slotProps">
          <div class="space-y-2">
            <button
              type="button"
              class="mr-2 inline-flex items-center rounded-md bg-green-600 p-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-100 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              @click="editWorkflow(slotProps.data.id)"
            >
              <PencilIcon class="h-6 w-6 text-white" />
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
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
          <InputText v-model="workflowMetadata.label" type="text" />
          <InlineMessage v-show="labelTaken"
            >A workflow with this name already exists</InlineMessage
          >
        </div>

        <div class="col-span-3 flex flex-col">
          <label
            for="last-name"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
            >ID</label
          >
          <InputText disabled v-model="workflowMetadata.id" type="text" />
        </div>

        <div class="col-span-6 flex flex-col">
          <label
            for="message"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
            >Description</label
          >
          <Textarea v-model="workflowMetadata.description" rows="5" cols="30" />
        </div>

        <div class="col-span-3 flex flex-col">
          <label
            for="last-name"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
            >Updated</label
          >
          <InputText disabled v-model="workflowMetadata.date" type="text" />
        </div>

        <div class="flex items-center justify-between sm:col-span-6">
          <button
            class="inline-block rounded-md bg-red-400 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-red-300 transition duration-100 hover:bg-red-600 focus-visible:ring active:bg-red-700 md:text-base"
            @click="toggleDeleteDialog"
          >
            Delete
          </button>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="toggleEditDialog"
          text
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="updateWorkflow"
          autofocus
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="deleteDialogVisible"
      modal
      header="Delete Workflow"
      :style="{ width: '50vw' }"
    >
      <p class="pb-5 dark:text-surface-200">
        Do you really want to delete this workflow?
      </p>
      <button
        type="button"
        class="mb-2 mr-2 border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
        @click="toggleDeleteDialog"
      >
        Cancel
      </button>
      <button
        type="button"
        class="mb-2 mr-2 bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        @click="deleteWorkflow"
      >
        Delete
      </button>
    </Dialog>
  </div>
</template>
