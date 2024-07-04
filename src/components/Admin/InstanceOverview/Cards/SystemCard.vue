<script setup lang="ts">
import { ISystem } from "@/components/Admin/InstanceOverview/types";

const props = defineProps<{
  system: ISystem
}>();
</script>
<template>
  <InformationCard header="System">
    <template #content>
      <InformationCardEntry header="Operating System">
        <template #content>
          {{ props.system["operating-system"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="System User ID">
        <template #content>
          {{ props.system["system-user-id"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="System Group ID">
        <template #content>
          {{ props.system["system-group-id"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Commands">
        <template #content>
          <ul class="list-disc">
            <li v-for="command of props.system['commands']" :key="command.command">
              {{ command.type }}, {{ command.command }}, {{ command.available }}
            </li>
          </ul>
        </template>
      </InformationCardEntry>
    </template>
  </InformationCard>
</template>
