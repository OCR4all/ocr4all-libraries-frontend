<script setup lang="ts">
import WideCard from "@/components/Dashboard/WideCard.vue";

import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useCustomFetch } from "@/composables/useCustomFetch";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const router = useRouter();
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Dashboard",
    to: "/",
  },
];

const projects: Ref<number | undefined> = ref();
const workflows: Ref<number | undefined> = ref();
const collections: Ref<number | undefined> = ref();
const folios: Ref<number | undefined> = ref();

useCustomFetch(`/project/list`)
  .get()
  .json()
  .then((response) => {
    projects.value = response.data.value.length;
  });
useCustomFetch(`/workflow/list`)
  .get()
  .json()
  .then((response) => {
    workflows.value = response.data.value.length;
  });
useCustomFetch(`/repository/container/list`)
  .get()
  .json()
  .then(async (response) => {
    collections.value = response.data.value;
    const counter = ref(0);
    for (const collection of response.data.value) {
      if (collection.right == "read") {
        await useCustomFetch(
          `/repository/container/folio/list/${collection.id}`,
        )
          .get()
          .json()
          .then((response) => {
            counter.value += response.data.value.length;
          });
      }
    }
    folios.value = counter.value;
  });

function startTour() {
  toast.add({
    severity: "info",
    summary: t("pages.dashboard.toasts.tour.summary"),
    detail: t("pages.dashboard.toasts.tour.detail"),
    life: 3000,
  });
}

const user = ref();

await useCustomFetch(`/account`)
  .get()
  .json()
  .then((response) => {
    user.value = response.data.value;
  });
</script>
<template>
  <h1
    class="group mb-4 flex text-3xl font-bold text-surface-900 dark:text-surface-0"
  >
    Hello, {{ user.name }}
    <span class="ml-2 group-hover:animate-waving-hand">👋</span>
  </h1>
  <div class="space-y-8 pb-8">
    <div class="grid grid-cols-2 grid-rows-1 gap-8 xl:grid-cols-4">
      <StatsCard>
        <template #title> {{ $t("pages.dashboard.stats.projects") }} </template>
        <template #value>
          <div v-if="projects">
            {{ projects }}
          </div>
          <div v-else>
            <Skeleton width="1rem" height="1rem" />
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title> Collections </template>
        <template #value>
          <div v-if="collections">
            {{ collections.length }}
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title> Folios </template>
        <template #value>
          <div>
            {{ folios }}
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title>
          {{ $t("pages.dashboard.stats.workflows") }}
        </template>
        <template #value>
          <div>
            {{ workflows }}
          </div>
        </template>
      </StatsCard>
    </div>
    <div class="grid grid-cols-5 grid-rows-1 gap-8 lg:grid-rows-2">
      <div class="col-span-5 row-span-2 xl:col-span-4">
        <ComponentContainer>
          <RecentProjectsOverview />
        </ComponentContainer>
      </div>
      <div class="col-span-2 row-span-2 xl:col-span-1 xl:row-span-1">
        <a href="https://www.ocr4all.org" target="_blank">
          <IconCard>
            <template #icon>
              <img
                class="m-auto h-20 w-20"
                src="/assets/dashboard/notebook-dynamic-gradient.png"
                alt="Notebook icon"
              />
            </template>
            <template #text>
              {{ $t("pages.dashboard.cards.documentation.title") }}
            </template>
          </IconCard>
        </a>
      </div>
      <div class="col-span-3 row-span-2 xl:col-span-1 xl:row-span-1">
        <IconCard class="hover:cursor-pointer" @click="router.push('settings')">
          <template #icon>
            <img
              class="m-auto h-20 w-20"
              src="/assets/dashboard/setting-dynamic-gradient.png"
              alt="Notebook icon"
            />
          </template>
          <template #text>
            {{ $t("pages.dashboard.cards.settings.title") }}
          </template>
        </IconCard>
      </div>
    </div>
    <div class="grid grid-flow-col gap-8">
      <div class="col-span-2 row-span-1">
        <WideCard @start-tour="startTour">
          <template #icon>
            <img
              class="m-auto h-20 w-20"
              src="/assets/dashboard/play-dynamic-gradient.png"
              alt="Notebook icon"
            />
          </template>
          <template #subtitle>
            {{ $t("pages.dashboard.cards.tour.subtitle") }}
          </template>
          <template #title>
            {{ $t("pages.dashboard.cards.tour.title") }}
          </template>
        </WideCard>
      </div>
      <div class="col-span-2 row-span-1">
        <NodeFlowCard>
          <template #icon>
            <img
              class="m-auto h-20 w-20"
              src="/assets/dashboard/file-plus-dynamic-gradient.png"
              alt="Notebook icon"
            />
          </template>
          <template #subtitle>
            {{ $t("pages.dashboard.cards.nodeflow.subtitle") }}
          </template>
          <template #title>
            {{ $t("pages.dashboard.cards.nodeflow.title") }}
          </template>
        </NodeFlowCard>
      </div>
    </div>
    <div class="grid grid-cols-4 grid-rows-1 gap-8">
      <div class="col-span-4 row-span-1 2xl:col-span-2">
        <ComponentContainer>
          <AvailableWorkflows />
        </ComponentContainer>
      </div>
      <div class="col-span-4 row-span-1 2xl:col-span-2">
        <ComponentContainer>
          <SmallJobQueue />
        </ComponentContainer>
      </div>
    </div>
  </div>
  <Toast />
</template>
