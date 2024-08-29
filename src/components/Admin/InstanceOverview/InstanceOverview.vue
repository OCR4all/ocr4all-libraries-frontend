<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { RemovableRef } from "@vueuse/core";
import { IAdministrationOverview } from "@/types/instance-overview.types";
import ServiceProviderPropertyCard from "@/components/Admin/InstanceOverview/Cards/ServiceProviderPropertyCard.vue";

const information: RemovableRef<IAdministrationOverview | undefined> = ref();

const isLoading = ref(true)
useCustomFetch("/administration/overview")
  .get()
  .json()
  .then((response) => {
    information.value = response.data.value
    isLoading.value = false
  })
</script>
<template>
  <div class="grid items-start gap-4 lg:grid-cols-2">
    <div class="grid gap-y-4 lg:gap-y-0">
      <ComponentContainer>
        <Skeleton v-if="isLoading" height="20rem" />
        <ApplicationCard v-else-if="information" :data="information.application" />
      </ComponentContainer>
      <ComponentContainer>
        <Skeleton v-if="isLoading" height="20rem" />
        <WorkspaceCard v-else-if="information" :workspace="information.workspace" />
      </ComponentContainer>
    </div>
    <div class="grid gap-y-4 lg:gap-y-0">
      <ComponentContainer>
        <Skeleton v-if="isLoading" height="20rem" />
        <FilesystemCard
          v-else-if="information"
          :exchange="information.exchange"
          :opt="information.opt"
          :temporary="information.temporary"
        >
        </FilesystemCard>
      </ComponentContainer>
      <ComponentContainer>
        <Skeleton v-if="isLoading" height="20rem" />
        <SystemCard v-else-if="information" :system="information.system" />
      </ComponentContainer>
      <ComponentContainer>
        <Skeleton v-if="isLoading" height="20rem" />
        <ServiceProviderPropertyCard
          v-else-if="information"
          :providers="information['service-provider-properties']"
        />
      </ComponentContainer>
    </div>
  </div>
</template>
