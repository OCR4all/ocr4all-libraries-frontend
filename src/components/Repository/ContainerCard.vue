<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Checkbox from "primevue/checkbox";
import Skeleton from "primevue/skeleton";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";

import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const toast = useToast();

const { t } = useI18n();

const props = defineProps<{
  title?: string;
  description?: string;
  keywords?: string[];
  id?: string;
}>();

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
          console.log("edit");
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
          deleteContainer();
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
</script>
<template>
  <Toast />
  <div class="grid grid-cols-1 justify-self-center">
    <div
      class="shadow-xs group relative m-2 grid h-64 w-64 rounded-md bg-clip-border text-surface-700 hover:bg-primary-100 hover:dark:bg-surface-700"
      :class="[
        checked
          ? ['bg-primary-100', 'dark:bg-surface-700']
          : ['bg-surface-100', 'dark:bg-surface-900'],
      ]"
    >
      <div
        class="absolute w-max group-hover:flex"
        :class="{ hidden: !checked && !actionMenuVisible }"
      >
        <div class="flex justify-between space-x-28 p-4">
          <Checkbox
            v-model="checked"
            @update:modelValue="updateSelection"
            :binary="true"
            :pt="{
              root: { class: 'z-50' },
              input: {
                class:
                  'peer absolute h-6 w-6 border border-solid cursor-pointer hover:bg-primary-200',
              },
            }"
          />
          <div class="flex space-x-2">
            <button
              class="bg-primary-600 p-2 font-semibold text-white hover:bg-primary-800"
              @click="openShareModal"
            >
              Share
            </button>
            <Button
              @click="toggle"
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
            />
            <Menu
              ref="actionMenu"
              id="overlay_menu"
              @blur="actionMenuBlurred"
              :model="actionMenuItems"
              :popup="true"
            />
          </div>
        </div>
      </div>
      <div
        class="mx-4 mt-4 h-fit w-fit self-center justify-self-center text-surface-700"
      >
        <i
          class="pi pi-folder text-7xl text-surface-700 dark:text-surface-0"
        ></i>
      </div>
    </div>
    <div class="mx-4 mb-4">
      <p
        @click="openContainer"
        class="cursor-pointer font-semibold text-black hover:underline dark:text-white"
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
