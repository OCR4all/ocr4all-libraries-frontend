<script setup lang="ts">
import InputText from "primevue/inputtext";
import Chips from "primevue/chips";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";

import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useCustomFetch } from "@/composables/useCustomFetch";

const router = useRouter();

const project = router.currentRoute.value.params.project;
const data = await useCustomFetch(`/project/entity?id=${project}`).get().json();

const id = ref(data.data.value.id);
const name = ref(data.data.value.name);
const description = ref(data.data.value.description);
const keywords = ref(data.data.value.keywords);
const state = ref({ name: data.data.value.state, code: data.data.value.state });

const states = ref([
  { name: "active", code: "active" },
  { name: "closed", code: "closed" },
  { name: "blocked", code: "blocked" },
]);

async function update() {
  const payload = {
    id: id.value,
    ...(name.value && { name: name.value }),
    ...(description.value && { description: description.value }),
    ...(state.value && { state: state.value.name }),
    ...(keywords.value && { keywords: Array.from(keywords.value) }),
  };
  const { isFetching, error, data } = await useCustomFetch(`/project/update`)
    .post(payload)
    .json();
  toast.add({
    severity: "success",
    summary: t("pages.projects.project.toasts.update.success.summary"),
    detail: t("pages.projects.project.toasts.update.success.detail"),
    life: 3000,
  });
}

const deleteDialogVisible = ref(false);

async function deleteProject() {
  const data = await useCustomFetch(`/project/remove?id=${project}`)
    .get()
    .json();
  router.push("/project/overview");
}
</script>

<template>
  <Toast />
  <div class="grid grid-cols-4 gap-4">
    <div class="col-span-4 flex flex-col">
      <label
        for="text"
        class="mb-2 inline-block text-sm text-gray-800 dark:text-white sm:text-base"
        >{{ $t("pages.projects.project.information.form.name") }}</label
      >
      <InputText v-model="name" type="text" />
    </div>

    <div class="col-span-4 flex flex-col">
      <label
        for="id"
        class="mb-2 inline-block text-sm text-gray-800 dark:text-white sm:text-base"
        >{{ $t("pages.projects.project.information.form.id") }}</label
      >
      <InputText v-model="id" disabled type="id" />
    </div>

    <div class="col-span-4 flex flex-col">
      <label
        for="keywords"
        class="mb-2 inline-block text-sm text-gray-800 dark:text-white sm:text-base"
        >{{ $t("pages.projects.project.information.form.keywords") }}</label
      >
      <Chips v-model="keywords" />
    </div>

    <div class="col-span-4 flex flex-col">
      <label
        for="state"
        class="mb-2 inline-block text-sm text-gray-800 dark:text-white sm:text-base"
        >{{ $t("pages.projects.project.information.form.state") }}</label
      >
      <Dropdown
        v-model="state"
        :options="states"
        option-label="name"
        placeholder="Select a City"
        class="md:w-14rem w-full"
      />
    </div>

    <div class="col-span-4 flex flex-col">
      <label
        for="description"
        class="mb-2 inline-block text-sm text-gray-800 dark:text-white sm:text-base"
        >{{ $t("pages.projects.project.information.form.description") }}</label
      >
      <Textarea v-model="description" rows="5" cols="30" />
    </div>
    <button
      class="col-span-4 inline-block rounded-lg bg-primary-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary-300 transition duration-100 hover:bg-primary-600 focus-visible:ring active:bg-primary-700 md:col-span-1 md:text-base"
      @click="update"
    >
      {{ $t("pages.projects.project.information.buttons.update") }}
    </button>
    <button
      type="button"
      class="col-span-4 inline-block rounded-lg bg-red-700 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-red-300 transition duration-100 hover:bg-red-600 focus-visible:ring active:bg-red-700 md:col-span-1 md:text-base"
      @click="deleteDialogVisible = true"
    >
      {{ $t("pages.projects.project.information.buttons.delete") }}
    </button>
    <Dialog
      v-model:visible="deleteDialogVisible"
      modal
      :header="$t('pages.projects.project.information.modals.delete.header')"
      :style="{ width: '50vw' }"
    >
      <p class="pb-5 dark:text-gray-200">
        {{ $t("pages.projects.project.information.modals.delete.content") }}
      </p>
      <button
        type="button"
        class="mb-2 mr-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-500 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        @click="deleteDialogVisible = false"
      >
        {{
          $t("pages.projects.project.information.modals.delete.buttons.cancel")
        }}
      </button>
      <button
        type="button"
        class="mb-2 mr-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        @click="deleteProject"
      >
        {{
          $t("pages.projects.project.information.modals.delete.buttons.delete")
        }}
      </button>
    </Dialog>
  </div>
</template>
