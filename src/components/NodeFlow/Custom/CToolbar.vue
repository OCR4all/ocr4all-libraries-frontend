<script setup lang="ts">
import { Commands } from "@baklavajs/renderer-vue";
import { useViewModel } from "baklavajs";

const { viewModel } = useViewModel();

const emit = defineEmits(["new", "load", "save", "zoom-in", "zoom-out", "rate-workflow", "toggle-palette"]);
</script>

<template>
  <div
    class="baklava-toolbar !z-10 !rounded-none !border-b-2 !border-solid !border-surface-200 !bg-surface-50 dark:!border-zinc-950 dark:!bg-zinc-900"
  >
    <div class="flex justify-between">
      <div class="flex space-x-4">
        <span v-tooltip="'Undo'">
        <i
          class="pi pi-undo self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="
            viewModel.commandHandler.executeCommand(Commands.UNDO_COMMAND)
          "
        ></i>
      </span>
        <span v-tooltip="'Redo'">
        <i
          class="pi pi-undo -scale-x-100 self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="
            viewModel.commandHandler.executeCommand(Commands.REDO_COMMAND)
          "
        ></i>
      </span>
        <div
          class="inline-block w-0.5 self-stretch bg-surface-500 opacity-100 dark:bg-surface-400 dark:opacity-50"
        ></div>
        <span v-tooltip="'New Workflow'">
        <i
          class="pi pi-plus self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('new')"
        ></i>
      </span>
        <span v-tooltip="'Load Workflow'">
        <i
          class="pi pi-upload self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('load')"
        ></i>
      </span>
        <span v-tooltip="'Save Workflow'">
        <i
          class="pi pi-save self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('save')"
        ></i>
      </span>
        <div
          class="inline-block w-0.5 self-stretch bg-surface-500 opacity-100 dark:bg-surface-400 dark:opacity-50"
        ></div>
        <span v-tooltip="'Select'">
        <i
          class="pi pi-copy self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="viewModel.commandHandler.executeCommand(Commands.START_SELECTION_BOX_COMMAND)"
        ></i>
      </span>
        <span v-tooltip="'Copy'">
        <i
          class="pi pi-copy self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="viewModel.commandHandler.executeCommand(Commands.COPY_COMMAND)"
        ></i>
      </span>
        <span v-tooltip="'Paste'">
        <i
          class="pi pi-search-plus self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="viewModel.commandHandler.executeCommand(Commands.PASTE_COMMAND)"
        ></i>
      </span>
        <div
          class="inline-block w-0.5 self-stretch bg-surface-500 opacity-100 dark:bg-surface-400 dark:opacity-50"
        ></div>
        <span v-tooltip="'Zoom Out'">
        <i
          class="pi pi-search-minus self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('zoom-out')"
        ></i>
      </span>
        <span v-tooltip="'Zoom In'">
        <i
          class="pi pi-search-plus self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('zoom-in')"
        ></i>
      </span>
        <div
          class="inline-block w-0.5 self-stretch bg-surface-500 opacity-100 dark:bg-surface-400 dark:opacity-50"
        ></div>
        <span v-tooltip="'Rate Workflow'">
        <i
          class="pi pi-check-circle self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('rate-workflow')"
        ></i>
      </span>
        <div
          class="inline-block w-0.5 self-stretch bg-surface-500 opacity-100 dark:bg-surface-400 dark:opacity-50"
        ></div>
        <span v-tooltip="'Toggle Palette'">
        <i
          class="pi pi-align-right self-center text-xl text-surface-600 hover:cursor-pointer hover:text-black dark:text-surface-400 dark:hover:text-white"
          @click="emit('toggle-palette')"
        ></i>
      </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
