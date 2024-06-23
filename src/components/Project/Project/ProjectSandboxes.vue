<script setup lang="ts">
import {
  ArrowPathIcon,
  EyeIcon,
  XMarkIcon,
  ArchiveBoxArrowDownIcon,
} from "@heroicons/vue/24/outline";
import { UseTimeAgo } from "@vueuse/components";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Toolbar from "primevue/toolbar";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import Tag from "primevue/tag";
import { FilterMatchMode } from "@primevue/core/api";

import { useCustomFetch } from "@/composables/useCustomFetch";

import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useSandboxCreationStore } from "@/stores/sandboxCreation.store";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const sandboxes = ref([]);
const isRefetching = ref(false);

const selectedSandbox = ref();

const isDeleteDialogVisible = ref(false);

const store = useSandboxCreationStore();

async function refetch() {
  isRefetching.value = true;
  useCustomFetch(`/sandbox/list/${project}`)
    .get()
    .json()
    .then((response) => {
      setTimeout(function () {
        isRefetching.value = response.isFetching.value;
      }, 500);
      sandboxes.value = response.data.value;
    });
}

refetch();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function createSandbox() {
  store.projectId = project;
  router.push(`/project/${project}/new-result`);
}

function toggleDeleteDialog(id) {
  selectedSandbox.value = id;
  isDeleteDialogVisible.value = true;
}

const getColor = (entry) => {
  switch (entry) {
    case "secured":
      return { background: "#1A56DB" };
    default:
      return null;
  }
};

async function removeResults() {
  useCustomFetch(`/sandbox/remove/${project}?id=${selectedSandbox.value}`)
    .get()
    .json()
    .then(() => {
      refetch();
      isDeleteDialogVisible.value = false;
      toast.add({
        severity: "success",
        summary: t(
          "pages.projects.sandbox.results.toasts.remove-results.success.summary",
        ),
        detail: t(
          "pages.projects.sandbox.results.toasts.remove-results.success.detail",
        ),
        life: 3000,
      });
    });
}
const downloadSandboxToastVisible = ref();
async function downloadSandbox(sandbox) {
  useCustomFetch(`/sandbox/zip/${project}?id=${sandbox}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${project}_${sandbox}.zip`);
      document.body.appendChild(link);
      link.click();
    });
}
</script>
<template>
  <Toast />
  <Toast
    position="top-center"
    group="headless"
    @close="downloadSandboxToastVisible = false"
  >
    <template #container="{ message, closeCallback }">
      <section
        class="grid w-full justify-center gap-3 p-3"
        style="border-radius: 10px"
      >
        <div class="flex w-full gap-3 justify-self-center">
          <i
            class="pi pi-cloud-upload text-2xl text-primary-950 dark:text-primary-0"
          ></i>
          <p
            class="m-0 text-base font-semibold text-primary-950 dark:text-primary-0"
          >
            {{ message.summary }}
          </p>
          <p class="m-0 text-base text-primary-950 dark:text-primary-0">
            {{ message.detail }}
          </p>
        </div>
        <div class="flex gap-2 justify-self-center">
          <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
        </div>
        <div class="mb-3 flex gap-3 justify-self-center">
          <Button
            label="Close"
            text
            class="px-2 py-1"
            @click="closeCallback"
          ></Button>
        </div>
      </section>
    </template>
  </Toast>
  <Toolbar class="mb-4">
    <template #start>
      <div class="my-2 space-x-2">
        <button
          type="button"
          class="rounded-md bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          @click="createSandbox()"
        >
          {{ $t("pages.projects.sandbox.results.toolbar.new") }}
        </button>
      </div>
    </template>
  </Toolbar>
  <DataTable
    :value="sandboxes"
    sortField="tracking.updated"
    :sortOrder="-1"
    :filters="filters"
    :globalFilterFields="['name', 'description', 'state']"
  >
    <template #header>
      <div class="flex justify-between">
        <h2 class="my-4 text-xl">
          {{ $t("pages.projects.sandbox.results.table.header") }}
        </h2>
        <div class="space-x-2">
          <button v-tooltip="'Refresh'" @click="refetch">
            <ArrowPathIcon
              :disabled="isRefetching"
              :class="{ 'animate-spin': isRefetching }"
              class="mr-2 inline h-6 w-6 text-surface-600 hover:text-black dark:text-surface-300 dark:hover:text-white"
            />
          </button>
          <span class="p-input-icon-left ml-10">
            <InputText
              v-model="filters['global'].value"
              :placeholder="
                $t('pages.projects.sandbox.results.table.search.placeholder')
              "
            />
          </span>
        </div>
      </div>
    </template>
    <template #empty>
      <span class="text-primary-950 dark:text-primary-50">{{
        $t("pages.projects.sandbox.results.table.empty")
      }}</span>
    </template>
    <Column :exportable="false" style="min-width: 8rem">
      <template #body="slotProps">
        <button
          type="button"
          class="mr-2 inline-flex items-center rounded-md bg-primary-600 p-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="
            router.push(`/project/${project}/result/${slotProps.data.id}`)
          "
        >
          {{ $t("pages.projects.sandbox.results.table.columns.open") }}
        </button>
      </template>
    </Column>
    <Column
      field="name"
      :header="$t('pages.projects.sandbox.results.table.columns.name')"
    ></Column>
    <Column
      field="description"
      :header="$t('pages.projects.sandbox.results.table.columns.description')"
    ></Column>
    <Column
      field="state"
      :sortable="true"
      :header="$t('pages.projects.sandbox.results.table.columns.state')"
      :show-filter-menu="false"
      :filter-menu-style="{ width: '14rem' }"
    >
      <template #body="{ data }">
        <Tag :value="data.state" :style="getColor(data.state)" />
      </template>
    </Column>
    <Column
      field="tracking.updated"
      :header="$t('pages.projects.sandbox.results.table.columns.updated')"
      :sortable="true"
    >
      <template #body="slotProps">
        <UseTimeAgo
          v-slot="{ timeAgo }"
          :time="Date.parse(slotProps.data.tracking.updated)"
        >
          {{ timeAgo }}
        </UseTimeAgo>
      </template>
    </Column>
    <Column
      :header="$t('pages.projects.sandbox.results.table.columns.actions')"
      :exportable="false"
      style="min-width: 8rem"
    >
      <template #body="slotProps">
        <button
          type="button"
          class="mr-2 inline-flex items-center rounded-md bg-red-600 p-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          @click="toggleDeleteDialog(slotProps.data.id)"
        >
          <XMarkIcon class="h-6 w-6 text-white" />
        </button>
        <button
          type="button"
          class="mr-2 inline-flex items-center rounded-md bg-primary-600 p-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          @click="downloadSandbox(slotProps.data.id)"
        >
          <ArchiveBoxArrowDownIcon class="h-6 w-6 text-white" />
        </button>
      </template>
    </Column>
  </DataTable>
  <Dialog
    v-model:visible="isDeleteDialogVisible"
    modal
    :header="$t('pages.projects.sandbox.results.modals.remove-results.header')"
    :style="{ width: '50vw' }"
  >
    <p class="pb-5 dark:text-surface-200">
      {{ $t("pages.projects.sandbox.results.modals.remove-results.content") }}
    </p>
    <button
      v-tooltip="'Cancel'"
      type="button"
      class="mb-2 mr-2 rounded-md border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-500 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
      @click="isDeleteDialogVisible = false"
    >
      {{
        $t(
          "pages.projects.sandbox.results.modals.remove-results.buttons.cancel.text",
        )
      }}
    </button>
    <button
      v-tooltip="'Remove Sandbox'"
      type="button"
      class="mb-2 mr-2 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      @click="removeResults"
    >
      {{
        $t(
          "pages.projects.sandbox.results.modals.remove-results.buttons.delete.text",
        )
      }}
    </button>
  </Dialog>
</template>
