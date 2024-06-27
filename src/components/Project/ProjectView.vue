<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";

import Images from "@/components/Project/Project/ProjectImages.vue";
import Information from "@/components/Project/Project/ProjectInformation.vue";
import Results from "@/components/Project/Project/ProjectSandboxes.vue";
import { useUiStore } from "@/stores/ui.store";

const router = useRouter();
const project: string[] = router.currentRoute.value.params.project;

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Projects",
    to: "/project/overview",
  },
  {
    label: project,
  },
];
</script>

<template>
  <Toast />
  <TabView>
    <TabPanel header="Results">
      <Results />
    </TabPanel>
    <TabPanel header="Images">
      <Images />
    </TabPanel>
    <TabPanel header="Information">
      <Information />
    </TabPanel>
  </TabView>
</template>
