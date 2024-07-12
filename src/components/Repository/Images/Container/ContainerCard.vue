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

const actionMenuItems = ref([
  {
    label: t("pages.repository.container.card.actions.label"),
    items: [
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
        label: t("pages.repository.container.card.actions.delete"),
        icon: "pi pi-times",
        command: () => {
          toggleDeleteDialog();
        },
      },
      {
        label: "Download",
        icon: "pi pi-download",
        command: () => {
          downloadContainer();
        },
      },
    ],
  },
]);

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

function updateSelection(event: Event) {
  emit("updateSelection", props.id, event);
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
  });
  emit("refresh");
}

const checked = ref();
const shareDialogVisible = ref();

async function updateContainerShare() {}

function openShareModal() {
  dialog.open(ShareDialog, {
    props: {
      header: "Share Container",
      modal: true,
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
    });
  }
}

const deleteDialogVisible = ref(false);
function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
}

const name = ref(props.title);
const keywords = ref(props.keywords);
const description = ref(props.description);

function select(doSelect: boolean) {
  checked.value = doSelect;
}

defineExpose({
  select,
});
</script>
<template>
  <Toast position="bottom-right" group="download-toast">
    <template #message="slotProps">
      <div class="flex-column align-items-start flex" style="flex: 1">
        <div class="align-items-center flex gap-4">
          <ProgressSpinner
            :pt="{
              root: {
                class:
                  'relative self-center mx-auto w-6 h-6 inline-block before:block before:pt-full',
              },
            }"
            animation-duration=".5s"
            aria-label="Custom ProgressSpinner"
          />
          <div class="text-md my-3 text-surface-800">
            {{ slotProps.message.summary }}
          </div>
        </div>
      </div>
    </template>
  </Toast>
  <Toast />
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
  <div class="grid grid-cols-1 justify-self-center">
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
        <div class="flex justify-between space-x-28 p-4">
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
            />
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
