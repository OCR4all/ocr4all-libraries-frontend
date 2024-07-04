<script setup lang="ts">
import { IServiceProviderProperties } from "@/components/Admin/InstanceOverview/types";

const props = defineProps<{
  providers: IServiceProviderProperties[],
}>();
</script>
<template>
  <InformationCard header="Service Provider Properties">
    <template #content>
      <InformationCardEntry
        v-for="provider of props.providers"
        :header="provider.key"
        @key="provider.key">
        <template #content>
          <Tag severity="info" :value="provider.collection"></Tag>
          {{ provider.value }}
        </template>
      </InformationCardEntry>
    </template>
  </InformationCard>
</template>
