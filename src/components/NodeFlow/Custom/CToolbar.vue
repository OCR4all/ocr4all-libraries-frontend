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
  <div class="baklava-toolbar dark:!bg-zinc-800">
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
        <DocumentArrowUpIcon
          class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
          @click="emit('load')"
        />
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
      <MagnifyingGlassMinusIcon
        class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
        @click="emit('zoom-out')"
      />
      <MagnifyingGlassPlusIcon
        class="h-6 w-6 text-gray-600 hover:cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
        @click="emit('zoom-in')"
      />
    </div>
  </div>
</template>

<style scoped>
.baklava-toolbar {
  @apply z-20 bg-gray-50 shadow-lg;
}
</style>
