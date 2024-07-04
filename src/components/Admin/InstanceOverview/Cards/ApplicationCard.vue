<script setup lang="ts">
import { IApplication } from "@/components/Admin/InstanceOverview/types";

const props = defineProps<{
  data: IApplication
}>();

const getDate = computed(() => {
  return new Date(Date.parse(props.data["start"]))
})
</script>
<template>
  <InformationCard header="Application">
    <template #content>
      <InformationCardEntry header="name">
        <template #content>
          {{ props.data.name }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Administration Group">
        <template #content>
          {{ props.data["administrator-group"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Coordinator Group">
        <template #content>
          {{ props.data["coordinator-group"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Charset">
        <template #content>
          {{ props.data.charset }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Monitor Interval">
        <template #content>
          {{ props.data["monitor-interval"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Date Format Pattern">
        <template #content>
          {{ props.data["date-format-pattern"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Start Time">
        <template #content>
          {{ getDate }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Active Profiles">
        <template #content>
          <ul class="list-disc">
            <li v-for="profile of props.data['active-profiles']" :key="profile">{{profile}}</li>
          </ul>
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Thread Pool Size">
        <template #content>
          <ul class="list-disc">
            <li v-for="[name, size] of Object.entries(props.data['thread-pool-size'])" :key="name">
              <span class="font-semibold">{{name}}:</span> {{size}}
            </li>
          </ul>
        </template>
      </InformationCardEntry>
    </template>
  </InformationCard>
</template>
