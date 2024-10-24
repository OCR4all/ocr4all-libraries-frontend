<script setup lang="ts">
import IconRefresh from "~icons/heroicons/arrow-path";
import IconCreate from "~icons/gridicons/create";

import { UseTimeAgo } from "@vueuse/components";

import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Toolbar from "primevue/toolbar";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import Tag from "primevue/tag";
import { FilterMatchMode } from "@primevue/core/api";

import { useSandboxCreationStore } from "@/stores/sandboxCreation.store";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";

import { useCustomFetch } from "@/composables/useCustomFetch";

import { useToast } from "primevue/usetoast";

const editSandboxDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Sandbox/Dialog/EditSandboxDialog.vue"),
);
const toast = useToast();

import IconActions from "~icons/fluent/more-vertical-32-regular";

import { useI18n } from "vue-i18n";
import { useDialog } from "primevue/usedialog";
const { t } = useI18n();

const dialog = useDialog();

const router = useRouter();
const project = router.currentRoute.value.params.project;

const sandboxes = ref([]);
const isRefetching = ref(false);

const selectedSandbox = ref();

const isDeleteDialogVisible = ref(false);

const loading = ref(true);

const store = useSandboxCreationStore();

const items = ref();
const menu = ref();
const contextMenu = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Open",
          icon: "pi pi-eye",
          command: () => {
            router.push(`/project/${project}/result/${data.id}`);
          },
        },
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            openSandboxEditDialog(data);
          },
        },
        {
          label: "Download",
          icon: "pi pi-download",
          command: () => {
            downloadSandbox(data.id);
          },
        },
        {
          label: "Download History",
          icon: "pi pi-history",
          command: () => {
            downloadHistory(data.id);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            toggleDeleteDialog(data.id);
          },
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

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

refetch().then(() => (loading.value = false));

const filters: Ref = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  keywords: { value: null, matchMode: FilterMatchMode.CONTAINS },
  state: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function createSandbox() {
  store.projectId = project;
  router.push(`/project/${project}/new-result`);
}

function toggleDeleteDialog(id) {
  selectedSandbox.value = id;
  isDeleteDialogVisible.value = true;
}

const getStateStyle = (entry) => {
  switch (entry) {
    case "secured":
      return "!bg-blue-600 !text-blue-100";
    case "paused":
      return "!bg-zinc-600 !text-zinc-100";
    case "closed":
      return "!bg-red-600 !text-red-100";
    case "canceled":
      return "!bg-yellow-600 !text-yellow-100";
    case "active":
      return "!bg-green-600 !text-green-100";
    default:
      return null;
  }
};

function openSandboxEditDialog(data) {
  dialog.open(editSandboxDialog, {
    props: {
      header: "Edit Result Metadata",
      modal: true,
      style: {
        width: "75vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    data: {
      sandbox: data,
      project: project,
    },
    onClose: () => {
      refetch();
    },
  });
}

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
        group: "general",
      });
    });
}
const downloadSandboxToastVisible = ref();
async function downloadSandbox(sandbox) {
  downloadSandboxToastVisible.value = true;
  toast.add({
    severity: "info",
    summary: "Download is prepared",
    group: "headless",
  });
  useCustomFetch(`/sandbox/zip/${project}?id=${sandbox}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${project}_${sandbox}.zip`);
      document.body.appendChild(link);
      link.click();
      toast.removeGroup("headless");
      downloadSandboxToastVisible.value = false;
    });
}
async function downloadHistory(sandbox) {
  useCustomFetch(`/sandbox/history/download/${project}?id=${sandbox}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${project}_${sandbox}_history.zip`);
      document.body.appendChild(link);
      link.click();
    });
}
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        router.push(`/project/${project}/result/${event.data.id}`);
      },
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        openSandboxEditDialog(event.data);
      },
    },
    {
      label: "Download",
      icon: "pi pi-download",
      command: () => {
        downloadSandbox(event.data.id);
      },
    },
    {
      label: "Download History",
      icon: "pi pi-history",
      command: () => {
        downloadHistory(event.data.id);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        toggleDeleteDialog(event.data.id);
      },
    },
  ];
  contextMenu.value.show(event.originalEvent);
};
</script>
<template>
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
          <ProgressSpinner
            style="width: 50px; height: 50px"
            stroke-width="8"
            fill="transparent"
            animation-duration=".5s"
            aria-label="Custom ProgressSpinner"
          />
        </div>
        <div class="mb-4 flex justify-center gap-4">
          <Button label="Cancel" size="small" @click="closeCallback">
            <p class="font-semibold text-white">Cancel</p>
          </Button>
        </div>
      </section>
    </template>
  </Toast>
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
  <ComponentContainer spaced>
    <Toolbar>
      <template #start>
        <Button
          v-tooltip.top="$t('pages.projects.sandbox.results.toolbar.new')"
          @click="createSandbox()"
          text
        >
          <IconCreate
            class="text-black dark:text-white"
            :class="{ 'animate-pulse': sandboxes.length === 0 }"
          />
        </Button>
      </template>
      <template #end>
        <div class="flex space-x-2">
          <button v-tooltip="'Refresh'" @click="refetch">
            <IconRefresh
              :disabled="isRefetching"
              :class="{ 'animate-spin': isRefetching }"
              class="inline h-6 w-6 text-surface-600 hover:text-black dark:text-surface-300 dark:hover:text-white"
            />
          </button>
          <span class="p-input-icon-left">
            <InputText
              v-model="filters['global'].value"
              :placeholder="
                $t('pages.projects.sandbox.results.table.search.placeholder')
              "
            />
          </span>
        </div>
      </template>
    </Toolbar>
    <DataTable
      :value="sandboxes"
      :loading="loading"
      resizableColumns
      columnResizeMode="expand"
      sort-field="tracking.updated"
      :sort-order="-1"
      v-model:filters="filters"
      :globalFilterFields="['name', 'description', 'keywords', 'engine']"
      filterDisplay="menu"
      context-menu
      :row-hover="true"
      :global-filter-fields="['name', 'description', 'state']"
      @row-contextmenu="onRowContextMenu"
    >
      <template #loading>
        <ProgressSpinner
          style="width: 50px; height: 50px"
          stroke-width="8"
          fill="transparent"
          animation-duration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </template>
      <template #empty>
        <span class="text-primary-950 dark:text-primary-50">{{
          $t("pages.projects.sandbox.results.table.empty")
        }}</span>
      </template>
      <Column
        field="name"
        sortable
        :header="$t('pages.projects.sandbox.results.table.columns.name')"
      >
        <template #body="{ data }">
          <p
            class="cursor-pointer hover:underline"
            @click="router.push(`/project/${project}/result/${data.id}`)"
          >
            {{ data.name }}
          </p>
        </template>
      </Column>
      <Column
        field="description"
        :header="$t('pages.projects.sandbox.results.table.columns.description')"
      ></Column>
      <Column
        field="keywords"
        :sortable="true"
        :header="'Keywords'"
        :show-filter-menu="false"
        :filter-menu-style="{ width: '14rem' }"
      >
        <template #body="{ data }">
          <Tag
            v-for="keyword of data.keywords"
            :key="keyword"
            :value="keyword"
          />
        </template>
      </Column>
      <Column
        field="state"
        :sortable="true"
        :header="$t('pages.projects.sandbox.results.table.columns.state')"
        :show-filter-menu="false"
        :filter-menu-style="{ width: '14rem' }"
      >
        <template #body="{ data }">
          <Tag :value="data.state" :class="getStateStyle(data.state)" />
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
      <Column :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="space-y-2">
            <Button
              type="button"
              text
              severity="secondary"
              @click="toggle($event, data)"
            >
              <IconActions class="text-surface-900 dark:text-surface-100" />
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </ComponentContainer>
</template>
