<script setup lang="ts">
import {
  CubeTransparentIcon,
  Bars3CenterLeftIcon,
  Squares2X2Icon,
  QueueListIcon,
  HomeIcon,
  Square3Stack3DIcon,
  ServerIcon,
  AcademicCapIcon,
} from "@heroicons/vue/24/outline";
import { useUiStore } from "@/stores/ui.store";
import { navigation } from "@/layout/Sidebar";

const uiStore = useUiStore();

const router = useRouter();

const minimized = ref(false);

const fixedSidebar = ref();
const sidebarHovered = useElementHover(fixedSidebar);

const maximized = computed(() => sidebarHovered.value || !minimized.value);

function toggleSidebar() {
  minimized.value = !minimized.value;
}
</script>

<template>
  <div
    ref="fixedSidebar"
    class="m-2 hidden lg:block"
    :class="[maximized ? 'w-64' : 'w-22']"
  >
    <div class="mx-6 my-4 flex justify-between">
      <img
        @click="router.push({ name: 'Dashboard' })"
        src="/img/logo.svg"
        class="h-12 w-12 cursor-pointer"
        alt="OCR4all logo"
      />
      <button
        @click="toggleSidebar"
        v-show="maximized"
        class="mt-1 hidden cursor-pointer rounded-md text-surface-600 hover:bg-surface-0 hover:text-surface-900 focus:bg-surface-0 focus:ring-4 focus:ring-surface-0 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white dark:focus:bg-surface-700 dark:focus:ring-surface-700 lg:block"
        type="button"
        value="Open sidebar"
        v-tooltip="'Toggle Sidebar'"
      >
        <Bars3CenterLeftIcon class="h-8 w-8" />
      </button>
    </div>
    <div class="space-x 2 mb-10 space-y-2 px-4 py-4">
      <router-link
        v-for="(item, index) in navigation"
        :key="index"
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
            class="mr-2 bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900"
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
        <p class="mb-3 text-sm text-surface-800 dark:text-blue-200">
          {{ $t("nav.sidebar.cta.content") }}
        </p>
      </div>
      <div v-else-if="uiStore.sidebarCtaVisible" class="flex justify-center">
        <span
          class="bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900"
          >{{ $t("nav.sidebar.cta.header") }}</span
        >
      </div>
    </div>
  </div>
</template>
