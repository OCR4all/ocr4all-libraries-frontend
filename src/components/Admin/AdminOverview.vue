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

const isLoadingUsers = ref(true)
const isLoadingGroups = ref(true)
const isLoadingProviders = ref(true)

useCustomFetch("/administration/security/user/list")
  .get()
  .json()
  .then((response) => {
    users.value += response.data.value.length;
    isLoadingUsers.value = false;
  });

useCustomFetch("/administration/security/group/list")
  .get()
  .json()
  .then((response) => {
    groups.value += response.data.value.length;
    isLoadingGroups.value = false;
  });

useCustomFetch("/administration/provider/overview")
  .get()
  .json()
  .then((response) => {
    for (const provider of Object.values(response.data.value)) {
      providers.value += provider.length;
    }
    isLoadingProviders.value = false;
  });
</script>
<template>
  <div class="mb-4 flex flex-col gap-y-2">
    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
      Stats
    </h1>
    <div class="grid grid-cols-1 grid-rows-1 gap-8 sm:grid-cols-3">
      <div>
        <Skeleton v-if="isLoadingUsers" width="14rem" height="6rem" borderRadius="10px"></Skeleton>
        <StatsCard v-else>
          <template #title> Users </template>
          <template #value>
            <div v-if="users">
              {{ users }}
            </div>
          </template>
        </StatsCard>
      </div>
      <div>
        <Skeleton v-if="isLoadingGroups" width="14rem" height="6rem" borderRadius="10px"></Skeleton>
        <StatsCard v-else>
          <template #title> Groups </template>
          <template #value>
            <div v-if="groups">
              {{ groups }}
            </div>
          </template>
        </StatsCard>
      </div>
      <div>
        <Skeleton v-if="isLoadingProviders" width="14rem" height="6rem" borderRadius="10px"></Skeleton>
        <StatsCard v-else>
          <template #title> Providers </template>
          <template #value>
            <div>
              {{ providers }}
            </div>
          </template>
        </StatsCard>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-y-2">
    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
      Instance Information
    </h1>
    <InstanceOverview />
  </div>
</template>
