<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";
import { mainNavigation, adminNavigation } from "@/layout/Sidebar";
import { SidebarMode } from "@/layout/Layout";

import CogIcon from "~icons/line-md/cog";

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

const maximized = computed(() => !uiStore.sidebarMinimized);
</script>

<template>
  <div
    class="m-1 hidden h-screen flex-none overflow-y-auto lg:block"
    :class="[maximized ? 'w-64' : 'w-22']"
  >
    <div
      class="mx-6 my-4 flex content-between justify-between"
      :class="{ 'flex-col space-y-6': !maximized }"
    >
      <img
        src="/img/logo.svg"
        class="h-12 w-12 cursor-pointer"
        alt="OCR4all logo"
        @click="router.push({ name: 'Pro' })"
      />
      <SidebarToggle />
    </div>
    <div
      class="grid content-between"
      :class="[
        maximized ? 'lg:h-[calc(100vh-7rem)]' : 'lg:h-[calc(100vh-10rem)]',
      ]"
    >
      <div class="mb-10 space-y-2 px-4 py-4">
        <router-link
          v-for="(item, index) in navigation"
          :key="index"
          v-tooltip="{
            value: $t(item.label),
            showDelay: 250,
            hideDelay: 250,
            disabled: maximized,
          }"
          :to="item.to"
          class="group flex items-center space-x-4 rounded-md px-4 py-2.5 text-surface-900 hover:bg-surface-200 dark:text-white dark:hover:bg-surface-800"
          :class="[maximized ? 'justify-start' : 'justify-center']"
        >
          <component :is="item.icon" class="h-6 w-6" />
          <p v-show="maximized">{{ $t(item.label) }}</p>
        </router-link>
        <!-- CTA -->
        <div
          v-if="maximized && uiStore.sidebarCtaVisible"
          id="dropdown-cta"
          class="mt-6 rounded-md bg-primary-100 p-4 dark:bg-primary-900"
          role="alert"
        >
          <div class="mb-3 flex items-center">
            <span
              class="mr-2 rounded-md bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900"
              >{{ $t("nav.sidebar.cta.header") }}</span
            >
            <button
              type="button"
              class="-mx-1.5 -my-1.5 ml-auto inline-flex h-6 w-6 p-1 text-surface-900 focus:ring-2 focus:ring-primary-400 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800"
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
          <i18n-t keypath="nav.sidebar.cta.content" tag="p" class="mb-3 text-sm text-surface-800 dark:text-blue-200">
            <a class="font-bold" href="https://gepris.dfg.de/gepris/projekt/460665940?context=projekt&task=showDetail&id=460665940&">{{ $t('nav.sidebar.cta.link') }}</a>
          </i18n-t>
        </div>
        <div v-else-if="uiStore.sidebarCtaVisible" class="flex justify-center">
          <span
            class="rounded-md bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900"
            >{{ $t("nav.sidebar.cta.header") }}</span
          >
        </div>
      </div>
      <div class="flex justify-center">
        <router-link
          v-tooltip="{
            value: 'Settings',
            showDelay: 250,
            hideDelay: 250,
          }"
          to="/settings"
          class="group flex items-center space-x-4 rounded-md px-4 py-2.5 text-surface-900 hover:bg-surface-200 dark:text-white dark:hover:bg-surface-800"
          :class="[maximized ? 'justify-start' : 'justify-center']"
        >
          <CogIcon class="h-6 w-6" />
        </router-link>
      </div>
    </div>
  </div>
</template>
