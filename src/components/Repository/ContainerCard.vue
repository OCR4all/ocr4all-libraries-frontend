<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Checkbox from "primevue/checkbox";
import Skeleton from "primevue/skeleton";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";

import { useI18n } from "vue-i18n";
import Chips from "primevue/chips";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const { t } = useI18n();

const props = defineProps<{
  title?: string;
  description?: string;
  keywords?: string[];
  id?: string;
}>();

const editDialogVisible = ref(false)

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
    query: { id: props.id, name: props.title },
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
    label: "Actions",
    items: [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          editDialogVisible.value = true;
        },
      },
      {
        label: "Share",
        icon: "pi pi-share-alt",
        command: () => {
          openShareModal()
        },
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: () => {
          toggleDeleteDialog();
        },
      },
    ],
  },
]);

function updateSelection(event: Event) {
  emit("updateSelection", props.id, event);
}

async function deleteContainer() {
  await useCustomFetch(`/repository/container/remove?id=${props.id}`);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Container deleted",
    life: 3000,
  })
  emit("refresh");
}

const checked = ref();
const shareDialogVisible = ref();

async function updateContainerShare() {}

function openShareModal() {
  toast.add({
    severity: "info",
    summary: "Not available",
    detail: "Sharing isn't available yet",
    life: 3000,
  })
}

function actionMenuBlurred(event) {
  actionMenuVisible.value = false;
}

async function updateContainer() {
  const payload = {
    "name": name.value,
    "keywords": keywords.value ? Array.from(keywords.value) : [],
    "description": description.value
  }
  const { isFetching, error, data } = await useCustomFetch(`/repository/container/update?id=${props.id}`)
    .post(payload)
    .json();
  emit("refresh")
  editDialogVisible.value = false
  if(!error.value){
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Container updated",
      life: 3000,
    });
  }else{
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Couldn't update container",
      life: 3000,
    });
  }
}

const deleteDialogVisible = ref(false);
function toggleDeleteDialog() {
  deleteDialogVisible.value = !deleteDialogVisible.value;
}

const name = ref(props.title)
const keywords = ref(props.keywords)
const description = ref(props.description)

function select(doSelect: boolean) {
  checked.value = doSelect;
}

defineExpose({
  select,
});
</script>
<template>
  <Toast />
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Delete Container"
    :style="{ width: '50vw' }"
  >
    <p class="pb-5 dark:text-surface-200">
      Do you really want to delete this container?
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
      @click="deleteContainer"
    >
      Delete
    </button>
  </Dialog>
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
        <InputText v-model="name" type="text" />
      </div>

      <div class="col-span-4 flex flex-col">
        <label
          for="description"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-white sm:text-base"
        >{{ $t("pages.projects.project.information.form.description") }}</label
        >
        <Textarea v-model="description" rows="5" cols="30" />
      </div>

      <div class="col-span-6 flex flex-col">
        <div class="col-span-4 flex flex-col">
          <label
            for="keywords"
            class="mb-2 inline-block text-sm text-surface-800 dark:text-white sm:text-base"
          >{{ $t("pages.projects.project.information.form.keywords") }}</label
          >
          <Chips v-model="keywords" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="editDialogVisible = false"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        autofocus
        @click="updateContainer"
      />
    </template>
  </Dialog>
  <div class="grid grid-cols-1 justify-self-center">
    <div
      class="shadow-xs group relative m-2 cursor-pointer grid h-64 w-64 rounded-md bg-clip-border text-surface-700 hover:bg-primary-100 hover:dark:bg-surface-700"
      :class="[
        checked
          ? ['bg-primary-100', 'dark:bg-surface-700']
          : ['bg-surface-100', 'dark:bg-surface-900'],
      ]"
      @click.self="openContainer"
    >
      <div
        class="absolute w-max group-hover:flex cursor-default"
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
              class="bg-primary-600 p-2 font-semibold text-white hover:bg-primary-800"
              @click="openShareModal"
            >
              Share
            </button>
            <Button
              icon="pi pi-ellipsis-v"
              severity="secondary"
              text
              rounded
              aria-haspopup="true"
              aria-label="overlay_menu"
              :pt="{
                root: { class: 'z-50 bg-surface-50/80 dark:bg-surface-50 p-1' },
                icon: { class: 'align-center pl-1' },
              }"
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
        @click="openContainer"
        class="mx-4 mt-4 h-fit w-fit self-center justify-self-center text-surface-700"
      >
        <i
          class="pi pi-folder text-7xl text-surface-700 dark:text-surface-0"
        ></i>
      </div>
    </div>
    <div class="mx-4 mb-4">
      <p
        class="cursor-pointer font-semibold text-black hover:underline dark:text-white"
        @click="openContainer"
      >
        {{ props.title }}
      </p>
      <div class="flex space-x-1">
        <p class="font-light text-surface-600 dark:text-surface-300">
          Container
        </p>
        <p class="font-light text-surface-600 dark:text-surface-300">·</p>
        <Skeleton v-if="!folios" width="1rem" height="1rem" />
        <p v-else class="font-light text-surface-600 dark:text-surface-300">
          {{ folios.length }} folios
        </p>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="shareDialogVisible"
    modal
    header="Edit Profile"
    :style="{ width: '25rem' }"
  >
    <span class="p-text-secondary mb-5 block">Update your information.</span>
    <div class="align-items-center mb-3 flex gap-3">
      <label for="username" class="w-6rem font-semibold">Username</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="align-items-center mb-5 flex gap-3">
      <label for="email" class="w-6rem font-semibold">Email</label>
      <InputText id="Email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="justify-content-end flex gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="shareDialogVisible = false"
      ></Button>
      <Button type="button" label="Save" @click="updateContainerShare"></Button>
    </div>
  </Dialog>
</template>
