<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import { useI18n } from "vue-i18n";
const t = useI18n();

const router = useRouter();

import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";

const countries = ref([
  { name: "🇩🇪", code: "de" },
  { name: "🇬🇧", code: "en" },
]);
const selectedCountry = ref(countries.value[1]);

const uiStore = useUiStore();
const authStore = useAuthStore();
const items = [
  { action: openSettings, name: "Settings", adminOnly: false },
  { action: openAdminDashboard, name: "Admin", adminOnly: true },
  { action: logout, name: "Log Out", adminOnly: false },
];

const visible = ref(false);

function openSettings() {
  visible.value = true;
}

function openAdminDashboard() {
  router.push("/admin");
}
function logout() {
  authStore.logout();
}

function save(){
  t.locale.value = selectedCountry.value.code
  useStorage("ocr4all/frontend/language", "en").value = selectedCountry.value.code
  visible.value = false
}
</script>

<template>
  <Menu as="div" class="mt-2">
    <MenuButton
      class="rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <img
        class="h-6 w-6 rounded-full"
        src="https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg"
        alt=""
      />
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out transform"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in transform"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <MenuItems
        class="absolute right-0 z-40 mt-2 w-48 origin-top-right overflow-hidden rounded-md border border-gray-100 bg-white shadow-lg focus:outline-none dark:border-gray-700 dark:bg-zinc-800"
      >
        <template v-for="(item, index) in items" :key="index">
          <MenuItem
            v-show="!item.adminOnly || (item.adminOnly && authStore.isAdmin)"
            v-slot="{ active }"
          >
            <a
              href="#"
              :class="{ 'bg-gray-100': active, 'dark:bg-gray-500': active }"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-white"
              @click="item.action"
              >{{ item.name }}</a
            >
          </MenuItem>
        </template>
      </MenuItems>
    </transition>
  </Menu>
  <Dialog
    v-model:visible="visible"
    modal
    header="Settings"
    :style="{ width: '50vw' }"
    :pt="{
      root: { class: 'dark:!bg-zinc-800' },
      header: { class: 'dark:!bg-zinc-800' },
      headerTitle: { class: 'dark:!text-white' },
      headerIcons: { class: 'dark:!text-white' },
      footer: { class: 'dark:!bg-zinc-800' },
      closeButton: { class: 'dark:!text-white' },
      content: { class: 'dark:!bg-zinc-800' },
    }"
  >
    <div class="grid grid-cols-2 grid-rows-2 gap-2">
      <div class="dark:!text-gray-200">Username</div>
      <p class="dark:!text-gray-200">{{ authStore.user }}</p>
      <div class="dark:!text-gray-200">Language</div>
      <Dropdown
        v-model="selectedCountry"
        :options="countries"
        optionLabel="name"
        placeholder="Language"
        class="md:w-14rem w-full"
        :pt="{
          root: {
            class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
          },
          input: {
            class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
          },
          list: {
            class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
          },
          header: {
            class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
          },
          filterContainer: {
            class: 'dark:!bg-zinc-700 dark:!text-white dark:!border-none',
          },
          item: {
            class:
              'dark:!bg-zinc-700 dark:hover:!bg-zinc-500 dark:!text-white dark:!border-none',
          },
        }"
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
          @click="visible = false" />
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
