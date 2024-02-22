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
        <ArrowUturnLeftIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="
            viewModel.commandHandler.executeCommand(Commands.UNDO_COMMAND)
          "
        />
      </span>
      <span v-tooltip="'Redo'">
        <ArrowUturnRightIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="
            viewModel.commandHandler.executeCommand(Commands.REDO_COMMAND)
          "
        />
      </span>
      <div
        class="inline-block w-0.5 self-stretch bg-gray-500 opacity-100 dark:bg-gray-400 dark:opacity-50"
      ></div>
      <span v-tooltip="'New Workflow'">
        <DocumentPlusIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('new')"
        />
      </span>
      <span v-tooltip="'Load Workflow'">
        <i
          class="pi pi-save h-6 w-6 self-center text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('load')"
        ></i>
      </span>
      <span v-tooltip="'Save Workflow'">
        <DocumentArrowDownIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('save')"
        />
      </span>
      <div
        class="inline-block w-0.5 self-stretch bg-gray-500 opacity-100 dark:bg-gray-400 dark:opacity-50"
      ></div>
      <span v-tooltip="'Zoom Out'">
        <MagnifyingGlassMinusIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('zoom-out')"
        />
      </span>
      <span v-tooltip="'Zoom In'">
        <MagnifyingGlassPlusIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('zoom-in')"
        />
      </span>
    </div>
  </div>
</template>

<style scoped></style>
