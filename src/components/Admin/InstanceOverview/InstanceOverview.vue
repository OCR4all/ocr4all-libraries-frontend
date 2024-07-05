<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { RemovableRef } from "@vueuse/core";
import { IAdministrationOverview } from "@/components/Admin/InstanceOverview/types";
import ServiceProviderPropertyCard from "@/components/Admin/InstanceOverview/Cards/ServiceProviderPropertyCard.vue";

const information: RemovableRef<IAdministrationOverview> = ref();

await useCustomFetch("/administration/overview")
  .get()
  .json()
  .then((data) => {
    information.value = data.data.value;
    console.log(information.value);
  });
</script>
<template>
  <div class="grid items-start gap-4 lg:grid-cols-2">
    <div>
      <ComponentContainer>
        <ApplicationCard :data="information.application" />
      </ComponentContainer>
      <ComponentContainer>
        <WorkspaceCard :workspace="information.workspace" />
      </ComponentContainer>
    </div>
    <div>
      <ComponentContainer>
        <FilesystemCard
          :exchange="information.exchange"
          :opt="information.opt"
          :temporary="information.temporary"
        >
        </FilesystemCard>
      </ComponentContainer>
      <ComponentContainer>
        <SystemCard :system="information.system" />
      </ComponentContainer>
      <ComponentContainer>
        <ServiceProviderPropertyCard
          :providers="information['service-provider-properties']"
        />
      </ComponentContainer>
    </div>
  </div>
</template>
