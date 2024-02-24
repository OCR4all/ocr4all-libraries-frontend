<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CubeTransparentIcon,
  Squares2X2Icon,
  QueueListIcon,
  HomeIcon,
  XMarkIcon,
  Square3Stack3DIcon,
  ServerIcon,
  AcademicCapIcon,
} from "@heroicons/vue/24/outline";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();

const sidebarMdOpened = ref(false);
const sidebarLgOpened = ref(true);

const mainNavigation = [
  { to: "/", label: "nav.sidebar.links.dashboard", icon: HomeIcon },
  {
    to: "/repository",
    label: "nav.sidebar.links.repository",
    icon: ServerIcon,
  },
  { to: "/project", label: "nav.sidebar.links.projects", icon: Squares2X2Icon },
  {
    to: "/workflows",
    label: "nav.sidebar.links.workflows",
    icon: Square3Stack3DIcon,
  },
  {
    to: "/nodeflow",
    label: "nav.sidebar.links.nodeflow",
    icon: CubeTransparentIcon,
  },
  {
    to: "/queue",
    label: "nav.sidebar.links.queue",
    icon: QueueListIcon
  },
  {
    to: "/training",
    label: "nav.sidebar.links.training",
    icon: AcademicCapIcon
  }
];

function toggleSidebarMd(val: boolean) {
  sidebarMdOpened.value = val;
}

function toggleSidebarLg() {
  sidebarLgOpened.value = !sidebarLgOpened.value;
}

defineExpose({
  toggleSidebarMd,
  toggleSidebarLg,
});
</script>

<template>
  <!-- Collapsible Sidebar -->
  <TransitionRoot
    :show="sidebarMdOpened"
    as="aside"
    class="overflow-y-auto border-r border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
  >
    <Dialog
      as="div"
      class="fixed inset-0 z-40 lg:hidden"
      @close="toggleSidebarMd(false)"
    >
      <TransitionChild
        enter="transition ease-in-out duration-200 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-200 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
        as="template"
      >
        <div
          class="relative z-10 flex h-full w-72 flex-col border-r border-gray-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800 lg:hidden"
        >
          <button
            value="Close sidebar"
            type="button"
            class="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full hover:ring-2 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
            @click="toggleSidebarMd(false)"
          >
            <XMarkIcon class="h-5 w-5 text-gray-800 dark:text-white" />
          </button>
          <div class="px-6 pb-4 pt-4">
            <img src="/img/logo.svg" class="h-9 w-48" alt="OCR4all logo" />
          </div>
          <div class="flex-1 overflow-y-auto">
            <div class="mx-2 mb-10">
              <router-link
                v-for="(item, index) in mainNavigation"
                :key="index"
                :to="item.to"
                class="flex items-center px-6 py-2.5 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
              >
                <component
                  :is="item.icon"
                  class="mr-2 h-5 w-5 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                />
                {{ $t(item.label) }}
              </router-link>
            </div>
          </div>
        </div>
      </TransitionChild>
      <TransitionChild
        enter="transition-opacity ease-linear duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
        as="template"
      >
        <DialogOverlay
          class="fixed inset-0 bg-zinc-600 bg-opacity-50"
        ></DialogOverlay>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
  <!-- Fixed Sidebar -->
  <TransitionRoot
    :show="sidebarLgOpened"
    as="div"
    class="overflow-y-auto border-r border-solid border-gray-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-800"
    enter="transition ease-in-out duration-200 transform"
    enter-from="-translate-x-full"
    enter-to="translate-x-0"
    leave="transition ease-in-out duration-200 transform"
    leave-from="translate-x-0"
    leave-to="-translate-x-full"
  >
    <div class="hidden w-64 lg:block">
      <div class="mb-10 space-y-2 px-6 py-8 pb-4">
        <router-link
          v-for="(item, index) in mainNavigation"
          :key="index"
          :to="item.to"
          class="group flex items-center p-2 px-6 py-2.5 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
        >
          <component :is="item.icon" class="mr-2 h-5 w-5" />
          {{ $t(item.label) }}
        </router-link>
        <!-- CTA -->
        <div
          v-show="uiStore.sidebarCtaVisible"
          id="dropdown-cta"
          class="mt-6 rounded-lg bg-primary-50 p-4 dark:bg-primary-900"
          role="alert"
        >
          <div class="mb-3 flex items-center">
            <span
              class="mr-2 bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900"
              >{{ $t("nav.sidebar.cta.header") }}</span
            >
            <button
              type="button"
              class="-mx-1.5 -my-1.5 ml-auto inline-flex h-6 w-6 bg-primary-50 p-1 text-primary-900 hover:bg-primary-200 focus:ring-2 focus:ring-primary-400 dark:bg-primary-900 dark:text-primary-400 dark:hover:bg-primary-800"
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
  </TransitionRoot>
</template>
