<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import DataTable, { DataTableRowContextMenuEvent } from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";

import IconRefresh from "~icons/heroicons/arrow-path"
import IconActions from "~icons/fluent/more-vertical-32-regular"

import { UseTimeAgo } from "@vueuse/components";

import { useCustomFetch } from "@/composables/useCustomFetch";
import { useUiStore } from "@/stores/ui.store";
import Button from "primevue/button";

const editDialog = defineAsyncComponent(
  () => import("@/components/Project/Project/Dialog/EditDialog.vue"),
);
const deleteDialog = defineAsyncComponent(
  () => import("@/components/Project/Project/Dialog/DeleteDialog.vue"),
);

const shareDialog = defineAsyncComponent(
  () => import("@/components/Project/Project/Dialog/ShareDialog.vue"),
);
const router = useRouter();

import IconCreate from "~icons/gridicons/create";
import { useDialog } from "primevue/usedialog";
import { useToast } from "primevue/usetoast";
const dialog = useDialog();

const loading = ref(true);
const isRefetching = ref(false);

const toast = useToast();

async function refetch() {
  isRefetching.value = true;
  const { isFetching, error, data } = await useCustomFetch(`/project/list`)
    .get()
    .json();
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value,
      life: 3000,
      group: "general",
    });
  } else {
    projects.value = data.value;

    console.log(projects.value);
  }
  loading.value = isFetching.value;
  setTimeout(function () {
    isRefetching.value = isFetching.value;
  }, 500);
}

const projects = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  state: { value: null, matchMode: FilterMatchMode.EQUALS },
  keywords: { value: null, matchMode: FilterMatchMode.IN },
});

const getSeverity = (entry) => {
  switch (entry) {
    case "active":
      return "success";
    case "closed":
      return "warning";
    case "blocked":
      return "danger";
    default:
      return null;
  }
};
const states = ref(["active", "closed", "blocked"]);

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Projects",
    to: "/project/overview",
  },
];

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
            router.push(`/project/${data.id}/view`);
          },
        },
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            dialog.open(editDialog, {
              props: {
                header: "Edit Project",
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
                refetch();
              },
            });
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            dialog.open(deleteDialog, {
              props: {
                header: "Delete Project",
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
                refetch();
              },
            });
          },
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
      label: "Open",
      icon: "pi pi-eye",
      command: () => {
        router.push(`/project/${event.data.id}/view`);
      },
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        dialog.open(editDialog, {
          props: {
            header: "Edit Project",
            modal: true,
            style: {
              width: "70vw",
            },
            breakpoints: {
              "960px": "80vw",
              "640px": "90vw",
            },
          },
          data: event.data,
          onClose: () => {
            refetch();
          },
        });
      },
    },
    {
      label: "Share",
      icon: "pi pi-share-alt",
      command: () => {
        dialog.open(shareDialog, {
          props: {
            header: `Share ${event.data.name}`,
            modal: true,
            style: {
              width: "75vw",
            },
            breakpoints: {
              "960px": "80vw",
              "640px": "90vw",
            },
          },
          data: event.data,
          onClose: () => {
            refetch();
          },
        });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        dialog.open(deleteDialog, {
          props: {
            header: "Delete Project",
            modal: true,
            style: {
              width: "70vw",
            },
            breakpoints: {
              "960px": "80vw",
              "640px": "90vw",
            },
          },
          data: event.data,
          onClose: () => {
            refetch();
          },
        });
      },
    },
  ];
  contextMenu.value.show(event.originalEvent);
};

const keywords = computed(() => {
  if (projects.value) {
    return projects.value.flatMap((item) =>
      item.keywords ? item.keywords.map((keyword) => ({ name: keyword })) : [],
    );
  }
  return [];
});

refetch();
</script>
<template>
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
          v-tooltip.top="$t('pages.projects.overview.toolbar.new')"
          text
          @click="router.push('/project/new')"
        >
          <IconCreate class="text-black dark:text-white" />
        </Button>
        <Button
          v-tooltip.top="$t('pages.projects.overview.toolbar.import')"
          text
          @click="router.push('/project/import')"
        >
          <i class="pi pi-upload text-black dark:text-white" />
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
            :placeholder="
              $t('pages.projects.overview.table.search.placeholder')
            "
          />
        </IconField>
      </template>
    </Toolbar>
    <DataTable
      v-model:filters="filters"
      :value="projects"
      :paginator="true"
      :rows="10"
      :loading="loading"
      scrollable
      context-menu
      filter-display="row"
      :global-filter-fields="['name', 'state', 'keywords']"
      sort-field="tracking.updated"
      :sort-order="-1"
      :row-hover="true"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rows-per-page-options="[10, 25, 50]"
      @row-contextmenu="onRowContextMenu"
    >
      <template #empty>
        <span class="text-primary-950 dark:text-primary-50">{{
          $t("pages.projects.overview.table.empty")
        }}</span>
      </template>
      <template #loading>
        <DefaultSpinner />
      </template>
      <Column
        field="name"
        class="max-w-xs"
        :header="$t('pages.projects.overview.table.columns.project')"
        :sortable="true"
      >
        <template #body="{ data }">
          <p
            class="cursor-pointer truncate hover:underline"
            @click="router.push(`/project/${data.id}/view`)"
          >
            {{ data.name }}
          </p>
        </template>
      </Column>
      <Column
        field="description"
        :header="$t('pages.projects.overview.table.columns.description')"
      >
        <template #body="slotProps">
          <p class="max-w-[10rem] truncate">
            {{ slotProps.data.description }}
          </p>
        </template>
      </Column>
      <Column
        field="state"
        :header="$t('pages.projects.overview.table.columns.state')"
      >
        <template #body="{ data }">
          <Tag :value="data.state" :severity="getSeverity(data.state)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            :options="states"
            placeholder="Select State"
            :show-clear="true"
            @change="filterCallback()"
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option"
                :severity="getSeverity(slotProps.option)"
              />
            </template>
          </Select>
        </template>
      </Column>
      <Column
        :sortable="true"
        :header="$t('pages.projects.overview.table.columns.keywords')"
      >
        <template #body="slotProps">
          <div class="flex gap-1">
            <Tag
              v-for="keyword in slotProps.data.keywords"
              :key="keyword.name"
              :value="keyword"
            />
          </div>
        </template>
      </Column>
      <Column
        field="tracking.created"
        :header="$t('pages.projects.overview.table.columns.created')"
        :sortable="true"
      >
        <template #body="slotProps">
          <UseTimeAgo
            v-slot="{ timeAgo }"
            :time="Date.parse(slotProps.data.tracking.created)"
          >
            {{ timeAgo }}
          </UseTimeAgo>
        </template>
      </Column>
      <Column
        field="tracking.updated"
        :header="$t('pages.projects.overview.table.columns.last-updated')"
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
