<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

import IconRefresh from "~icons/heroicons/arrow-path";
import IconStop from "~icons/heroicons/stop";
import IconTrash from "~icons/heroicons/trash";

const jobInfoDialog = defineAsyncComponent(
  () => import("@/components/Queue/Dialog/JobInfoDialog.vue"),
);

import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import { FilterMatchMode } from "@primevue/core/api";
import IconExpunge from "~icons/ant-design/clear-outlined";
import IconActions from "~icons/fluent/more-vertical-32-regular";

const dialog = useDialog();

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useToast } from "primevue/usetoast";
import { useCustomFetch } from "@/composables/useCustomFetch";
import { IJob, IQueue } from "@/components/Queue/queue.interfaces";
import { Ref } from "vue";
import { useDialog } from "primevue/usedialog";
import { useLocalDateFormat } from "@/composables/useLocalDateFormat";
import Toolbar from "primevue/toolbar";
import { IMenuItems } from "@/types/ui.types";
import { useConfirm } from "primevue/useconfirm";
const toast = useToast();

const loading: Ref<boolean> = ref(true);
const isRefetching: Ref<boolean> = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
  state: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const states: Ref<string[]> = ref([
  "scheduled",
  "running",
  "interrupted",
  "cancelled",
  "completed",
]);

const jobs: Ref<IJob[] | undefined> = ref();

const getColor = (
  entry: string,
): { background: string; color: string } | undefined => {
  switch (entry) {
    case "scheduled":
      return { background: "#76A9FA", color: "white" };
    case "running":
      return { background: "#1A56DB", color: "white" };
    case "interrupted":
      return { background: "#4B5563", color: "white" };
    case "cancelled":
      return { background: "#E02424", color: "white" };
    case "completed":
      return { background: "#046C4E", color: "white" };
    default:
  }
};
async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(
    `/job/overview/domain`,
  )
    .get()
    .json();
  if (error.value) {
    toast.add({
      severity: "error",
      summary: t("pages.login.toasts.login.error.summary"),
      detail: error.value,
      life: 3000,
      group: "general",
    });
  } else {
    const queue: IQueue = data.value;
    const _jobs: IJob[] = [];
    for (const entries of Object.values(queue)) {
      for (const job of entries) {
        _jobs.push(job);
      }
    }
    loading.value = isFetching.value;
    setTimeout(function () {
      isRefetching.value = isFetching.value;
    }, 500);
    jobs.value = _jobs;
  }
}

function calculateProgress(data) {
  return data.state === "completed" ? 100 : data.journal.progress * 100;
}

refetch();

const { pause } = useIntervalFn(function () {
  refetch();
}, 5000);

onUnmounted(() => {
  pause;
});
async function cancelJob(id: string) {
  const data = await useCustomFetch(`/job/cancel/${id}`).get().json();
  await refetch().then(() => {
    toast.add({
      severity: "success",
      summary: t("pages.queue.table.toasts.cancel.success.summary"),
      detail: t("pages.queue.table.toasts.cancel.success.detail"),
      life: 3000,
      group: "general",
    });
  });
}

async function expungeJobs() {
  useCustomFetch(`job/scheduler/action/expunge`)
    .then(() => {
      refetch();
    })
    .then(() => {
      toast.add({
        severity: "success",
        summary: t("pages.queue.table.toasts.expunge.success.summary"),
        detail: t("pages.queue.table.toasts.expunge.success.detail"),
        life: 3000,
        group: "general",
      });
    });
}

async function removeJob(job: string) {
  useCustomFetch(`job/remove/${job}`)
    .then(() => {
      refetch();
    })
    .then(() => {
      toast.add({
        severity: "success",
        summary: t("pages.queue.table.toasts.remove.success.summary"),
        detail: t("pages.queue.table.toasts.remove.success.detail"),
        life: 3000,
        group: "general",
      });
    });
}

const items: Ref<IMenuItems[]> = ref([]);
const menu = ref();

const toggle = (event, data) => {
  items.value = [
    {
      label: "Actions",
      items: [
        {
          label: "Info",
          icon: "pi pi-info-circle",
          command: () => openInfoDialog(data),
        },
      ],
    },
  ];
  menu.value.toggle(event);
};

const contextMenu = ref();
const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  items.value = [
    {
      label: "Info",
      icon: "pi pi-info-circle",
      command: () => openInfoDialog(event.data),
    },
  ];
  contextMenu.value.show(event.originalEvent);
};

function openInfoDialog(data) {
  console.debug(data);
  dialog.open(jobInfoDialog, {
    props: {
      header: "Job Information",
      modal: true,
      style: {
        width: "85vw",
      },
      breakpoints: {
        "960px": "90vw",
        "640px": "95vw",
      },
    },
    data: data,
    onClose: () => {
      refetch();
    },
  });
}

const confirm = useConfirm();
const router = useRouter();

function goToResult(project: string, sandbox: string) {
  confirm.require({
    message: "Open Result View?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    position: "bottom",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: () => {
      router.push(`/project/${project}/result/${sandbox}`);
    },
    reject: () => {},
  });
}

onUnmounted(() => {});
</script>

<template>
  <ConfirmDialog />
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
          v-tooltip.top="'Expunge queue'"
          severity="danger"
          @click="expungeJobs"
          text
        >
          <IconExpunge />
        </Button>
      </template>

      <template #end>
        <button
          v-tooltip.left="'Refresh'"
          :disabled="isRefetching === true"
          @click="refetch"
        >
          <IconRefresh
            :class="{ 'animate-spin': isRefetching }"
            class="mr-2 inline h-6 w-6 text-surface-600 hover:text-black dark:text-surface-200 hover:dark:text-white"
          />
        </button>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="filters['global'].value"
            :placeholder="$t('pages.queue.table.search.placeholder')"
          />
        </IconField>
      </template>
    </Toolbar>
    <DataTable
      v-model:filters="filters"
      :value="jobs"
      paginator
      filter-display="row"
      @row-contextmenu="onRowContextMenu"
      :global-filter-fields="['id', 'description', 'state']"
      :loading="loading"
      resizableColumns
      columnResizeMode="expand"
      :rows="5"
      :rows-per-page-options="[5, 10, 20, 50]"
      table-style="min-width: 50rem"
    >
      <template #empty>
        <span class="text-primary-950 dark:text-primary-50">{{
          $t("pages.queue.table.empty")
        }}</span>
      </template>
      <Column :header="$t('pages.queue.table.columns.actions')">
        <template #body="slotProps">
          <span class="space-y-2">
            <button
              :disabled="
                !['running', 'scheduled'].includes(slotProps.data.state)
              "
              type="button"
              class="mr-2 inline-flex items-center rounded-md bg-red-700 p-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 dark:disabled:bg-red-400"
              @click="cancelJob(slotProps.data.id)"
            >
              <IconStop class="h-6 w-6 text-white" />
            </button>
            <button
              :disabled="
                ['running', 'scheduled'].includes(slotProps.data.state)
              "
              type="button"
              class="mr-2 inline-flex items-center rounded-md bg-red-700 p-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 dark:disabled:bg-red-400"
              @click="removeJob(slotProps.data.id)"
            >
              <IconTrash class="h-6 w-6 text-white" />
            </button>
          </span>
        </template>
      </Column>
      <Column
        field="id"
        :sortable="true"
        :header="$t('pages.queue.table.columns.id')"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Search by id"
          />
        </template>
      </Column>
      <Column
        field="description"
        :header="$t('pages.queue.table.columns.description')"
      >
        <template #body="{ data }">
          <div
            v-if="
              data &&
              data.state === 'completed' &&
              data.process &&
              data.process['project-id'] &&
              data.process['sandbox-id']
            "
          >
            <p
              class="cursor-pointer hover:underline"
              @click="
                goToResult(
                  data.process['project-id'],
                  data.process['sandbox-id'],
                )
              "
            >
              {{ data.description }}
            </p>
          </div>
          <p v-else>
            {{ data.description }}
          </p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Search by description"
          />
        </template>
      </Column>
      <Column
        field="state"
        :sortable="true"
        header="State"
        :show-filter-menu="false"
      >
        <template #body="{ data }">
          <Tag :value="data.state" :style="getColor(data.state)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            placeholder="Select State"
            :options="states"
            class="p-column-filter"
            :show-clear="true"
            @change="filterCallback()"
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option"
                :style="getColor(slotProps.option)"
              />
            </template>
          </Select>
        </template>
      </Column>
      <Column
        field="journal.progress"
        :header="$t('pages.queue.table.columns.progress')"
        sortable
        :show-filter-match-modes="false"
        style="min-width: 12rem"
      >
        <template #body="slotProps">
          <ProgressBar
            :value="calculateProgress(slotProps.data)"
            :show-value="false"
            style="height: 6px"
          ></ProgressBar>
        </template>
      </Column>
      <Column
        :sortable="true"
        field="created"
        :header="$t('pages.queue.table.columns.created')"
      >
        <template #body="slotProps">
          <div v-tooltip.left="useLocalDateFormat(slotProps.data.created)">
            <UseTimeAgo
              v-slot="{ timeAgo }"
              :time="Date.parse(slotProps.data.created)"
            >
              {{ timeAgo }}
            </UseTimeAgo>
          </div>
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
