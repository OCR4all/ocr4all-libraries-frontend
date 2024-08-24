<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import ShareDialog from "@/components/Repository/Images/Container/Dialog/ShareDialog.vue";

import Button from "primevue/button";
import Menu from "primevue/menu";
import Checkbox from "primevue/checkbox";
import Skeleton from "primevue/skeleton";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";

import { useI18n } from "vue-i18n";
import Chips from "primevue/chips";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import { IContainer } from "@/components/Repository/Images/images.interface";
import { useDialog } from "primevue/usedialog";
const toast = useToast();

const dialog = useDialog()

const { t } = useI18n();

const props = defineProps<IContainer>();

const editDialogVisible = ref(false);

const folios = ref();
useCustomFetch(`/repository/container/folio/list/${props.id}`)
  .json()
  .then((response) => {
    folios.value = response.data.value;
  });

const router = useRouter();
function openContainer() {
  router.push({
    path: "/repository/container",
    query: { id: props.id, name: props.name },
  });
}

const emit = defineEmits(["refresh", "updateSelection"]);

const actionMenu = ref();
const actionMenuVisible = ref();
const toggle = (event: Event) => {
  actionMenu.value.toggle(event);
  actionMenuVisible.value = actionMenu.value.overlayVisible;
};

const getSelectLabel = computed(() => {
  return checked.value ? "Deselect" : "Select"
});

const actionMenuItems = ref([
  {
    label: t("pages.repository.container.card.actions.label"),
    items: [
      {
        label: getSelectLabel,
        icon: "pi pi-check-square",
        command: () => {
          toggleCheckbox();
        },
      },
      {
        label: t("pages.repository.container.card.actions.edit"),
        icon: "pi pi-pencil",
        command: () => {
          editDialogVisible.value = true;
        },
      },
      {
        label: t("pages.repository.container.card.actions.share"),
        icon: "pi pi-share-alt",
        command: () => {
          openShareModal();
        },
      },
      {
        label: "Download",
        icon: "pi pi-download",
        command: () => {
          downloadContainer();
        },
      },
      {
        label: t("pages.repository.container.card.actions.delete"),
        icon: "pi pi-times",
        command: () => {
          toggleDeleteDialog();
        },
      },
    ],
  },
]);

const items = ref([
  {
    label: "Open",
    icon: "pi pi-eye",
    command: () => {
      router.push({
        name: "Container",
        query: { id: props.id, name: props.name },
      });
    }
  },
      {
        label: getSelectLabel,
        icon: "pi pi-check-square",
        command: () => {
          toggleCheckbox();
        },
      },
      {
        label: t("pages.repository.container.card.actions.edit"),
        icon: "pi pi-pencil",
        command: () => {
          editDialogVisible.value = true;
        },
      },
      {
        label: t("pages.repository.container.card.actions.share"),
        icon: "pi pi-share-alt",
        command: () => {
          openShareModal();
        },
      },
      {
        label: "Download",
        icon: "pi pi-download",
        command: () => {
          downloadContainer();
        },
      },
      {
        label: t("pages.repository.container.card.actions.delete"),
        icon: "pi pi-times",
        command: () => {
          toggleDeleteDialog();
        },
      },
]);

const contextMenu = ref()

const onContextMenu = (event) => {
  contextMenu.value.show(event);
};

function downloadContainer() {
  toast.add({
    severity: "info",
    summary: "Preparing download",
    group: "download-toast",
  });
  useCustomFetch(`/repository/container/folio/zip/${props.id}`)
    .blob()
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data.value]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${props.name}.zip`);
      document.body.appendChild(link);
      link.click();
      toast.removeGroup("download-toast");
    });
}

function updateSelection(toggle: boolean) {
  console.log(toggle)
  emit("updateSelection", props.id, toggle);
}

async function deleteContainer() {
  await useCustomFetch(`/repository/container/remove?id=${props.id}`);
  toast.add({
    severity: "success",
    summary: t(
      "pages.repository.container.card.toast.delete-container.summary",
    ),
    detail: t("pages.repository.container.card.toast.delete-container.detail"),
    life: 3000,
    group: "general",
  });
  emit("refresh");
}

const checked = ref();
const shareDialogVisible = ref();

function openShareModal() {
  dialog.open(ShareDialog, {
    props: {
      header: `Share "${props.name}"`,
      modal: true,
      style: {
        width: '70vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '90vw'
      },
    },
    data: props,
    onClose: () => {
      emit("refresh");
    },
  });
  console.log()
  /*  toast.add({
    severity: "info",
    summary: t(
      "pages.repository.container.card.toast.share-modal.info.summary",
    ),
    detail: t("pages.repository.container.card.toast.share-modal.info.detail"),
    life: 3000,
  });*/
}

function actionMenuBlurred(event) {
  actionMenuVisible.value = false;
}

async function updateContainer() {
  const payload = {
    name: name.value,
    keywords: keywords.value ? Array.from(keywords.value) : [],
    description: description.value,
  };
  const { isFetching, error, data } = await useCustomFetch(
    `/repository/container/update?id=${props.id}`,
  )
    .post(payload)
    .json();
  emit("refresh");
  editDialogVisible.value = false;
  if (!error.value) {
    toast.add({
      severity: "success",
      summary: t(
        "pages.repository.container.card.toast.update-container.success.summary",
      ),
      detail: t(
        "pages.repository.container.card.toast.update-container.success.detail",
      ),
      life: 3000,
      group: "general",
    });
  } else {
    toast.add({
      severity: "error",
      summary: t(
        "pages.repository.container.card.toast.update-container.error.summary",
      ),
      detail: t(
        "pages.repository.container.card.toast.update-container.error.detail",
      ),
      life: 3000,
      group: "general",
    });
  }
}

const deleteDialogVisible = ref(false);
function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
}

const name = ref(props.name);
const keywords = ref(props.keywords);
const description = ref(props.description);

function select(doSelect: boolean) {
  checked.value = doSelect;
}

function toggleCheckbox(){
  checked.value = !checked.value
  updateSelection(checked.value)
}



defineExpose({
  select,
});
</script>
<template>
  <Toast position="bottom-right" group="download-toast">
    <template #container="{ message, closeCallback }">
      <div class="flex items-center w-full p-4 rounded-lg shadow bg-surface-200/50 dark:bg-surface-700/50 backdrop-md" role="alert">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
          <ProgressSpinner class="w-4 h-4" strokeWidth="8" fill="transparent"
                           animationDuration=".5s" aria-label="Download Spinner" />
          <span class="sr-only">Fire icon</span>
        </div>
        <div class="ms-3 text-sm text-surface-800 dark:text-surface-100 font-normal">{{ message.summary }}</div>
        <button @click="closeCallback" type="button" class="ms-auto -mx-1.5 -my-1.5 text-surface-800 hover:text-surface-950 rounded-lg focus:ring-2 focus:ring-surface-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-surface-200 dark:hover:text-white dark:hover:bg-gray-800" data-dismiss-target="#toast-default" aria-label="Close">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    </template>
  </Toast>
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    :header="t('pages.repository.container.card.dialog.delete.header')"
    :style="{ width: '50vw' }"
  >
    <p class="pb-5 dark:text-surface-200">
      {{ t("pages.repository.container.card.dialog.delete.content") }}
    </p>
    <button
      type="button"
      class="mb-2 mr-2 rounded-md border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
      @click="toggleDeleteDialog"
    >
      {{ t("pages.repository.container.card.dialog.delete.button.cancel") }}
    </button>
    <button
      type="button"
      class="mb-2 mr-2 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      @click="deleteContainer"
    >
      {{ t("pages.repository.container.card.dialog.delete.button.delete") }}
    </button>
  </Dialog>
  <Dialog
    v-model:visible="editDialogVisible"
    modal
    :header="t('pages.repository.container.card.dialog.delete.button.cancel')"
    :style="{ width: '50vw' }"
  >
    <div class="mx-auto grid grid-cols-6 gap-4">
      <div class="col-span-3 flex flex-col">
        <label
          for="text"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
          >{{
            t("pages.repository.container.card.dialog.edit.form.name")
          }}</label
        >
        <InputText v-model="name" type="text" />
      </div>

      <div class="col-span-4 flex flex-col">
        <label
          for="description"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-white sm:text-base"
          >{{
            t("pages.repository.container.card.dialog.edit.form.description")
          }}</label
        >
        <Textarea v-model="description" rows="5" cols="30" />
      </div>

      <div class="col-span-6 flex flex-col">
        <div class="col-span-4 flex flex-col">
          <label
            for="keywords"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-white sm:text-base"
            >{{
              t("pages.repository.container.card.dialog.edit.form.keywords")
            }}</label
          >
          <Chips v-model="keywords" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        :label="t('pages.repository.container.card.dialog.edit.button.cancel')"
        icon="pi pi-times"
        text
        @click="editDialogVisible = false"
      />
      <Button
        :label="t('pages.repository.container.card.dialog.edit.button.save')"
        icon="pi pi-check"
        autofocus
        @click="updateContainer"
      />
    </template>
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
  <div class="grid grid-cols-1 justify-self-center" @contextmenu="onContextMenu">
    <div
      class="shadow-xs group relative m-2 grid h-64 w-64 cursor-pointer rounded-md bg-clip-border text-surface-700 hover:bg-primary-100 hover:dark:bg-surface-800"
      :class="[
        checked
          ? ['bg-primary-100', 'dark:bg-surface-700']
          : ['bg-surface-100', 'dark:bg-surface-950'],
      ]"
      @click.self="openContainer"
    >
      <div
        class="absolute w-max cursor-default group-hover:flex"
        :class="{ hidden: !checked && !actionMenuVisible }"
      >
        <div class="flex justify-between space-x-28 p-2">
          <Checkbox
            v-model="checked"
            :binary="true"
            :pt="{
              root: { class: 'z-50' },
              input: {
                class:
                  'peer absolute h-6 w-6 border border-solid cursor-pointer hover:bg-primary-200',
              },
            }"
            @update:model-value="updateSelection"
          />
          <div class="flex space-x-2">
            <button
              class="bg-primary-600 p-2 rounded-sm font-semibold text-white hover:bg-primary-800"
              @click="openShareModal"
            >
              {{ t("pages.repository.container.card.button.share") }}
            </button>
            <Button
              icon="pi pi-ellipsis-v"
              severity="secondary"
              text
              rounded
              aria-haspopup="true"
              aria-label="overlay_menu"
              @click="toggle"
            />
            <Menu
              id="overlay_menu"
              ref="actionMenu"
              :model="actionMenuItems"
              :popup="true"
              @blur="actionMenuBlurred"
            >    <template #item="{ item, props }">
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
          </div>
        </div>
      </div>
      <div
        class="mx-4 mt-4 h-fit w-fit self-center justify-self-center text-surface-700"
        @click="openContainer"
      >
        <i
          class="pi pi-folder text-surface-700 dark:text-surface-0"
          style="font-size: 2.5rem"
        ></i>
      </div>
    </div>
    <div class="mx-4 mb-4">
      <p
        class="cursor-pointer font-semibold text-black hover:underline dark:text-white"
        @click="openContainer"
      >
        {{ props.name }}
      </p>
      <div class="flex space-x-1">
        <p class="font-light text-surface-600 dark:text-surface-300">
          {{ t("pages.repository.container.card.container") }}
        </p>
        <p class="font-light text-surface-600 dark:text-surface-300">·</p>
        <Skeleton v-if="!folios" width="1rem" height="1rem" />
        <p v-else class="font-light text-surface-600 dark:text-surface-300">
          {{ folios.length }} {{ t("pages.repository.container.card.folios") }}
        </p>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="shareDialogVisible"
    modal
    :header="t('pages.repository.container.card.dialog.share.header')"
    :style="{ width: '25rem' }"
  >
  </Dialog>
</template>
