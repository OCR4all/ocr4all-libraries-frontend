<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Checkbox from "primevue/checkbox";
import Image from "primevue/image";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";

import { useToast } from "primevue/usetoast";
const ImageEditor = defineAsyncComponent(
  () =>
    import(
      "@/components/Repository/Images/ImageEditor.vue"
      ),
);
import { useDialog } from "primevue/usedialog";
const toast = useToast();

const dialog = useDialog();

const props = defineProps<{
  name?: string;
  format?: string;
  keywords?: string[];
  size?: object;
  date?: string;
  user?: string;
  id?: string;
  containerId?: string;
}>();

const thumb = ref()
const detail = ref()

const emit = defineEmits(["refresh", "updateSelection"]);

const actionMenu = ref();
const toggle = (event: Event) => {
  actionMenu.value.toggle(event);
};

const actionMenuItems = ref([
  {
    label: "Actions",
    items: [
      {
        label: "Edit Metadata",
        icon: "pi pi-file-edit",
        command: () => {
          toast.add({
            severity: "info",
            summary: "Info",
            detail: "Not implemented yet",
            life: 3000,
            group: "general",
          });
        },
      },
      {
        label: "Image Editor",
        icon: "pi pi-pencil",
        command: () => {
          openImageEditor();
        },
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: () => {
          toggleDeleteDialog();
        },
      },
      {
        label: "Download",
        icon: "pi pi-download",
        command: () => {
          downloadFolio();
        },
      },
    ],
  },
]);

useCustomFetch(
  `/repository/container/folio/derivative/thumbnail/${props.containerId}?id=${props.id}`,
)
  .get()
  .blob()
  .then((response) => {
    thumb.value = useObjectUrl(response.data.value);
  });

async function loadDetail() {
  useCustomFetch(
    `/repository/container/folio/derivative/best/${props.containerId}?id=${props.id}`,
  )
    .get()
    .blob()
    .then((response) => {
      detail.value = useObjectUrl(response.data.value);
    });
}

function downloadFolio() {
  useCustomFetch(
    `/repository/container/folio/download/${props.containerId}?id=${props.id}`,
  )
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${props.name}.${props.format}`);
      document.body.appendChild(link);
      link.click();
    });
}

function updateSelection(event: Event) {
  emit("updateSelection", props.id, event);
}

function select(doSelect: boolean) {
  checked.value = doSelect;
  emit("updateSelection", props.id, doSelect);
}

function openImageEditor() {
  dialog.open(ImageEditor, {
    props: {
      header: "Edit Image",
      modal: true,
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
    },
    data: {
      container: props.containerId,
      id: props.id
    },
    onClose: () => {
      console.log("closed")
    }
  })
}
async function deleteFolio() {
  await useCustomFetch(
    `/repository/container/folio/remove/entity/${props.containerId}?id=${props.id}`,
  );
  select(false);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Folio deleted",
    life: 3000,
    group: "general",
  });
  toggleDeleteDialog();
  emit("refresh");
}

const checked = ref();

const deleteDialogVisible = ref(false);
function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
}

defineExpose({
  select,
});
</script>
<template>
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Delete Folio"
    :style="{ width: '50vw' }"
  >
    <p class="pb-5 dark:text-surface-200">
      Do you really want to delete this folio?
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
      @click="deleteFolio"
    >
      Delete
    </button>
  </Dialog>
  <div class="grid grid-cols-1">
    <div
      class="shadow-xs group relative m-2 grid h-64 w-64 rounded-md bg-clip-border text-surface-700 hover:bg-primary-200 hover:dark:bg-surface-700"
      :class="[
        checked
          ? ['bg-primary-200', 'dark:bg-surface-700']
          : ['bg-surface-100', 'dark:bg-surface-950'],
      ]"
    >
      <div
        class="absolute w-max group-hover:flex"
        :class="{ hidden: !checked }"
      >
        <div class="flex justify-between space-x-44 p-4">
          <Checkbox
            v-model="checked"
            :binary="true"
            :pt="{
              root: { class: 'z-50' },
              input: {
                class:
                  'rounded-md peer absolute h-6 w-6 border border-solid cursor-pointer hover:bg-primary-200',
              },
            }"
            @update:model-value="updateSelection"
          />
          <Button
            icon="pi pi-ellipsis-v"
            severity="secondary"
            text
            rounded
            aria-haspopup="true"
            aria-label="overlay_menu"
            :pt="{
              root: {
                class:
                  'rounded-md z-50 bg-surface-50/80 dark:bg-surface-50 p-1',
              },
              icon: { class: 'align-center pl-1' },
            }"
            @click="toggle"
          />
          <Menu
            id="overlay_menu"
            ref="actionMenu"
            :model="actionMenuItems"
            :popup="true"
          />
        </div>
      </div>
      <div
        class="mx-4 mt-4 h-fit w-fit self-center justify-self-center text-surface-700"
      >
        <Image v-if="thumb" alt="Image" preview>
          <template #previewicon>
            <i class="pi pi-search" style="padding: 100%" @click="loadDetail"></i>
          </template>
          <template #image>
            <img
              :src="thumb.value"
              class="max-w-48 max-h-48 object-scale-down"
              alt="image"
            />
          </template>
          <template #preview="slotProps">
            <img
              v-if="detail"
              :src="detail.value"
              alt="preview"
              class="max-h-screen"
              :style="slotProps.style"
              @click="slotProps.onClick"
            />
          </template>
        </Image>
        <Skeleton v-else animation="wave" size="10rem"></Skeleton>
      </div>
    </div>
    <div class="mx-4 mb-4">
      <p class="font-semibold text-black dark:text-white">{{ props.name }}</p>
      <p class="font-light text-surface-600 dark:text-surface-300">
        {{ format }} · {{ props.size.width }}x{{ props.size.height }}
      </p>
    </div>
  </div>
</template>
