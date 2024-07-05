<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Administration",
  },
  {
    label: "Overview",
  },
];

useHead({
  title: "Administration",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});

const users = ref(0);
const groups = ref(0);
const providers = ref(0);

await useCustomFetch("/administration/security/user/list")
  .get()
  .json()
  .then((response) => {
    users.value += response.data.value.length;
  });

await useCustomFetch("/administration/security/group/list")
  .get()
  .json()
  .then((response) => {
    groups.value += response.data.value.length;
  });

await useCustomFetch("/administration/provider/overview")
  .get()
  .json()
  .then((response) => {
    for (const provider of Object.values(response.data.value)) {
      providers.value += provider.length;
    }
  });
</script>
<template>
  <div class="mb-4 flex flex-col gap-y-2">
    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
      Stats
    </h1>
    <div class="grid grid-cols-1 grid-rows-1 gap-8 sm:grid-cols-3">
      <StatsCard>
        <template #title> Users </template>
        <template #value>
          <div v-if="users">
            {{ users }}
          </div>
          <div v-else>
            <Skeleton width="1rem" height="1rem" />
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title> Groups </template>
        <template #value>
          <div v-if="groups">
            {{ groups }}
          </div>
        </template>
      </StatsCard>
      <StatsCard>
        <template #title> Providers </template>
        <template #value>
          <div>
            {{ providers }}
          </div>
        </template>
      </StatsCard>
    </div>
  </div>
  <div class="flex flex-col gap-y-2">
    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
      Information
    </h1>
    <InstanceOverview />
  </div>
</template>
