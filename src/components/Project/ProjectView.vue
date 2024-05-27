<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";

import Images from "@/components/Project/Project/ProjectImages.vue";
import Information from "@/components/Project/Project/ProjectInformation.vue";
import Results from "@/components/Project/Project/ProjectSandboxes.vue";
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();

const router = useRouter();
const project: string[] = router.currentRoute.value.params.project;

/*uiStore.breadcrumb = {
  home: { to: "/project/overview", label: "Projects" },
  current: { label: project },
};*/
uiStore.breadcrumb = project;
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
