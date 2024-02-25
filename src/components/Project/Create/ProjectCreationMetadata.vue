<script setup lang="ts">
import { useProjectCreationStore } from "@/stores/projectCreation.store";

const emit = defineEmits(["next"]);

import Chips from "primevue/chips";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

import { useCustomFetch } from "@/composables/useCustomFetch";

const store = useProjectCreationStore();

const id = ref(store.projectId);
const name = ref(store.projectId);
const description = ref();
const keywords = ref();

async function save() {
  const payload = {
    id: id.value,
    ...(name.value && { name: name.value }),
    ...(description.value && { description: description.value }),
    ...(keywords.value && { keywords: Array.from(keywords.value) }),
  };
  const { isFetching, error, data } = await useCustomFetch(`/project/update`)
    .post(payload)
    .json();
  if (!error.value) {
    emit("next");
  }
}

function skip() {
  emit("next");
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center space-y-10 dark:text-surface-100 sm:p-12"
  >
    <h2
      class="mb-2 text-xl font-bold text-black dark:text-white sm:text-2xl md:text-3xl"
    >
      {{ $t("pages.projects.new.components.metadata.directive") }}
    </h2>
    <div class="mx-auto grid grid-cols-6 gap-4">
      <div class="col-span-3 flex flex-col">
        <label
          for="text"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
          >{{ $t("pages.projects.new.components.metadata.form.name") }}</label
        >
        <InputText v-model="name" type="text" />
      </div>

      <div class="col-span-3 flex flex-col">
        <label
          for="last-name"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
          >{{ $t("pages.projects.new.components.metadata.form.id") }}</label
        >
        <InputText v-model="id" disabled type="text" />
      </div>

      <div class="col-span-6 flex flex-col">
        <label
          for="email"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
          >{{
            $t("pages.projects.new.components.metadata.form.keywords")
          }}</label
        >
        <Chips v-model="keywords" />
      </div>

      <div class="col-span-6 flex flex-col">
        <label
          for="message"
          class="mb-2 inline-block text-sm text-surface-800 dark:text-surface-200 sm:text-base"
          >{{
            $t("pages.projects.new.components.metadata.form.description")
          }}</label
        >
        <Textarea v-model="description" rows="5" cols="30" />
      </div>

      <div class="flex items-center justify-between sm:col-span-6">
        <button
          class="inline-block rounded-lg bg-surface-400 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-surface-300 transition duration-100 hover:bg-surface-600 focus-visible:ring active:bg-surface-700 md:text-base"
          @click="skip"
        >
          {{ $t("pages.projects.new.components.metadata.buttons.skip") }}
        </button>
        <button
          class="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
          @click="save"
        >
          {{ $t("pages.projects.new.components.metadata.buttons.save") }}
        </button>
      </div>
    </div>
  </div>
</template>
