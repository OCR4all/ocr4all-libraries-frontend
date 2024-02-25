<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Checkbox from "primevue/checkbox";
import Image from "primevue/image";

const props = defineProps<{
  name?: string;
  format?: string;
  keywords?: string[];
  size?: object;
  date?: string;
  user?: string;
  id?: string;
  containerId?: string;
  src?: string;
}>();

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
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          console.log("edit");
        },
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: () => {
          deleteFolio();
        },
      },
    ],
  },
]);

function updateSelection(event: Event) {
  emit("updateSelection", props.id, event);
}

function select(doSelect: boolean){
  checked.value = doSelect
  emit("updateSelection", props.id, doSelect);
}

async function deleteFolio() {
  await useCustomFetch(
    `/repository/container/folio/remove/entity/${props.containerId}?id=${props.id}`,
  );
  select(false)
  emit("refresh");
}

const checked = ref();

defineExpose({
  select
})
</script>
<template>
  <div class="grid grid-cols-1 justify-self-center">
    <div
      class="shadow-xs group relative m-2 grid h-64 w-64 bg-clip-border text-surface-700 hover:bg-primary-200 hover:dark:bg-surface-600"
      :class="[
        checked
          ? ['bg-primary-200', 'dark:bg-surface-700']
          : ['bg-surface-100', 'dark:bg-surface-900'],
      ]"
    >
      <div
        class="absolute w-max group-hover:flex"
        :class="{ hidden: !checked }"
      >
        <div class="flex justify-between space-x-44 p-4">
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
            :model="actionMenuItems"
            :popup="true"
          />
        </div>
      </div>
      <div
        class="mx-4 mt-4 h-fit w-fit self-center justify-self-center text-surface-700"
      >
        <Image v-if="src" alt="Image" preview>
          <template #indicatoricon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img
              :src="src"
              class="max-w-48 max-h-48 object-scale-down"
              alt="image"
            />
          </template>
          <template #preview="slotProps">
            <img
              :src="src"
              alt="preview"
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
