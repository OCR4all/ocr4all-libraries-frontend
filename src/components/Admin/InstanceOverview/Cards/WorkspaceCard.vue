<script setup lang="ts">
import { IWorkspace } from "@/components/Admin/InstanceOverview/types";

const props = defineProps<{
  workspace: IWorkspace
}>();
</script>
<template>
  <InformationCard header="Workspace">
    <template #content>
      <InformationCardEntry header="Folder">
        <template #content>
          {{ props.workspace.folder }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Version">
        <template #content>
          {{ props.workspace.version }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Default Version">
        <template #content>
          {{ props.workspace["default-version"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Projects folder">
        <template #content>
          {{ props.workspace["projects-folder"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="User File">
        <template #content>
          {{ props.workspace["user-file"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Group File">
        <template #content>
          {{ props.workspace["group-file"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Password File">
        <template #content>
          {{ props.workspace["password-file"] }}
        </template>
      </InformationCardEntry>
      <InformationCardEntry header="Thread Pools">
        <template #content>
          <ul class="list-disc">
            <li v-for="pool of props.workspace['thread-pools']" :key="pool.name">
              <span class="font-semibold">{{pool.name}}:</span> {{pool.size}}
            </li>
          </ul>
        </template>
      </InformationCardEntry>
    </template>
  </InformationCard>
</template>
