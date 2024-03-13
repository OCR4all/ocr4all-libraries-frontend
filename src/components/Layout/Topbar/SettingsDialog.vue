<script setup lang="ts">
interface ILanguage {
  name: string;
  code: string;
}

import { useUiStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";

import { useI18n } from "vue-i18n";

const t = useI18n();

import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const uiStore = useUiStore();
const authStore = useAuthStore();

const countries: Ref<ILanguage[]> = ref([
  { name: "German 🇩🇪", code: "de" },
  { name: "English 🇬🇧", code: "en" },
]);
const selectedCountry = ref(countries.value[1]);
function save() {
  t.locale.value = selectedCountry.value.code;
  useStorage("ocr4all/frontend/language", "en").value =
    selectedCountry.value.code;
  uiStore.settingsDialogOpen = false;
}
</script>
<template>
  <Dialog
    v-model:visible="uiStore.settingsDialogOpen"
    modal
    header="Settings"
    :style="{ width: '50vw' }"
  >
    <div class="grid grid-cols-2 grid-rows-2 gap-2">
      <div class="dark:!text-surface-200">Username</div>
      <p class="dark:!text-surface-200">{{ authStore.user }}</p>
      <div class="dark:!text-surface-200">Language</div>
      <Dropdown
        v-model="selectedCountry"
        :options="countries"
        optionLabel="name"
        placeholder="Language"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="align-items-center flex">
            <img
              :alt="slotProps.value.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag mr-2 flag-${slotProps.value.code.toLowerCase()}`"
              style="width: 18px"
            />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="align-items-center flex">
            <img
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag mr-2 flag-${slotProps.option.code.toLowerCase()}`"
              style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>
    </div>
    <template #footer>
      <Button
        :label="$t('settings.buttons.close')"
        icon="pi pi-times"
        text
        @click="uiStore.settingsDialogOpen = false"
      />
      <Button
        :label="$t('settings.buttons.save')"
        severity="info"
        icon="pi pi-check"
        autofocus
        @click="save"
      />
    </template>
  </Dialog>
</template>
