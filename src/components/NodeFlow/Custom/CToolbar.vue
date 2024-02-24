<script setup lang="ts">
import { Commands } from "@baklavajs/renderer-vue";
import { useViewModel } from "baklavajs";

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/vue/24/outline";

const { viewModel } = useViewModel();

const emit = defineEmits(["new", "load", "save", "zoom-in", "zoom-out"]);
</script>

<template>
  <div
    class="baklava-toolbar !z-20 !rounded-none !border-b-2 !border-solid !border-gray-200 !bg-gray-50 dark:!border-zinc-950 dark:!bg-zinc-900"
  >
    <div class="flex justify-start space-x-4">
      <span v-tooltip="'Undo'">
        <i
          class="pi pi-undo text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="viewModel.commandHandler.executeCommand(Commands.UNDO_COMMAND)"
        ></i>
      </span>
      <span v-tooltip="'Redo'">
        <i
          class="pi pi-undo -scale-x-100 text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="viewModel.commandHandler.executeCommand(Commands.REDO_COMMAND)"
        ></i>
      </span>
      <div
        class="inline-block w-0.5 self-stretch bg-gray-500 opacity-100 dark:bg-gray-400 dark:opacity-50"
      ></div>
      <span v-tooltip="'New Workflow'">
        <i
          class="pi pi-plus text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('new')"
        ></i>
      </span>
      <span v-tooltip="'Load Workflow'">
        <i
          class="pi pi-upload text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('load')"
        ></i>
      </span>
      <span v-tooltip="'Save Workflow'">
        <i
          class="pi pi-save text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('save')"
        ></i>
      </span>
      <div
        class="inline-block w-0.5 self-stretch bg-gray-500 opacity-100 dark:bg-gray-400 dark:opacity-50"
      ></div>
      <span v-tooltip="'Zoom Out'">
        <i
          class="pi pi-search-minus text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('zoom-out')"
        ></i>
      </span>
      <span v-tooltip="'Zoom In'">
        <i
          class="pi pi-search-plus text-xl self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('zoom-in')"
        ></i>
      </span>
    </div>
  </div>
</template>

<style scoped></style>
