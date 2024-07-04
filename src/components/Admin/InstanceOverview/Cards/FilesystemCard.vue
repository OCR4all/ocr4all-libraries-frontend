<script setup lang="ts">
import { IExchange, IOpt, ITemporary, IWorkspace } from "@/components/Admin/InstanceOverview/types";

const props = defineProps<{
  exchange: IExchange,
  opt: IOpt,
  temporary: ITemporary,
}>();
</script>
<template>
  <InformationCard header="File System">
    <template #content>
      <InformationCardEntry header="Exchange">
        <template #content>
          {{ props.exchange.folder }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Opt">
        <template #content>
          {{ props.opt.folder }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Temporary">
        <template #content>
          {{ props.temporary.folder }}
        </template>
      </InformationCardEntry>
    </template>
  </InformationCard>
</template>
