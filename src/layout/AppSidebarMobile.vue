<script setup lang="ts">
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import { adminNavigation, mainNavigation } from "@/layout/Sidebar";
import { useUiStore } from "@/stores/ui.store";
import { SidebarMode } from "@/layout/Layout";

const props = defineProps<{
  mode: SidebarMode;
}>();

const uiStore = useUiStore();

const router = useRouter();

const navigation = computed(() => {
  switch (props.mode) {
    case SidebarMode.Main:
      return mainNavigation;
    case SidebarMode.Admin:
      return adminNavigation;
  }
});

const sidebarMobileOpen = ref(false);

function toggleSidebarMobile() {
  sidebarMobileOpen.value = !sidebarMobileOpen.value;
}

defineExpose({
  toggleSidebarMobile,
});
</script>
<template>
  <Drawer v-model:visible="sidebarMobileOpen">
    <template #container="{ closeCallback }">
      <div class="flex h-full flex-col">
        <div class="flex shrink-0 items-center justify-between px-6 pt-4">
          <img
            src="/img/logo.svg"
            class="h-12 w-12 cursor-pointer"
            alt="OCR4all logo"
            @click="router.push({ name: 'Dashboard' })"
          />
          <span>
            <Button
              type="button"
              text
              @click="closeCallback"
            >
              <p class="text-surface-800 dark:text-surface-200 hover:text-surface-950 hover:dark:text-surface-0">
                <i class="pi pi-times"></i>
              </p>
            </Button>
          </span>
        </div>
        <div class="grid h-full content-between overflow-y-auto">
          <ul class="m-0 list-none p-4">
            <router-link
              v-for="(item, index) in navigation"
              :key="index"
              v-tooltip="{
                value: $t(item.label),
                showDelay: 250,
                hideDelay: 250,
              }"
              :to="item.to"
              class="group flex items-center space-x-4 rounded-md px-4 py-2.5 text-surface-900 hover:bg-surface-200 dark:text-white dark:hover:bg-surface-800"
            >
              <component :is="item.icon" class="h-6 w-6" />
              <p>{{ $t(item.label) }}</p>
            </router-link>
          </ul>
          <div class="flex justify-center pb-12">
            <router-link
              v-tooltip="{
                value: 'Settings',
                showDelay: 250,
                hideDelay: 250,
              }"
              to="/settings"
              class="group flex items-center justify-center space-x-4 rounded-md px-4 py-2.5 text-surface-900 hover:bg-surface-200 dark:text-white dark:hover:bg-surface-800"
            >
              <Cog6ToothIcon class="h-6 w-6" />
            </router-link>
          </div>
        </div>
      </div>
    </template>

    <div
      class="relative z-10 flex h-full w-72 flex-col border-r border-surface-200 bg-surface-100 shadow-xl dark:border-zinc-700 dark:bg-surface-900 md:bg-white dark:md:bg-surface-800 lg:hidden"
    >
      <button
        value="Close sidebar"
        type="button"
        class="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-md hover:ring-2 hover:ring-surface-300 focus:outline-none focus:ring-2 focus:ring-surface-600"
        @click="toggleSidebarMobile"
      >
        <XMarkIcon class="h-5 w-5 text-surface-800 dark:text-white" />
      </button>
      <div class="px-6 pb-4 pt-4">
        <img src="/img/logo.svg" class="h-9 w-48" alt="OCR4all logo" />
      </div>
      <div class="flex-1 overflow-y-auto">
        <div class="mx-2 mb-10">
          <router-link
            v-for="(item, index) in navigation"
            :key="index"
            :to="item.to"
            class="flex items-center rounded-md px-6 py-2.5 text-surface-900 hover:bg-surface-100 dark:text-white dark:hover:bg-surface-700"
          >
            <component
              :is="item.icon"
              class="mr-2 h-5 w-5 text-surface-900 hover:bg-surface-100 dark:text-white dark:hover:bg-surface-700"
            />
            {{ $t(item.label) }}
          </router-link>
          <div
            v-show="uiStore.sidebarCtaVisible"
            id="dropdown-cta"
            class="mt-6 rounded-md bg-primary-50 p-4 dark:bg-primary-900"
            role="alert"
          >
            <div class="mb-3 flex items-center">
              <span
                class="mr-2 bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900"
                >{{ $t("nav.sidebar.cta.header") }}</span
              >
              <button
                type="button"
                class="-mx-1.5 -my-1.5 ml-auto inline-flex h-6 w-6 bg-primary-50 p-1 text-primary-900 hover:bg-primary-200 focus:ring-2 focus:ring-primary-400 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800"
                @click="uiStore.sidebarCtaVisible = false"
              >
                <span class="sr-only">Close</span>
                <svg
                  aria-hidden="true"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <p class="mb-3 text-sm text-blue-800 dark:text-blue-400">
              {{ $t("nav.sidebar.cta.content") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
