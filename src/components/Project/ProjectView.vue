<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";

import Images from "@/components/Project/Project/ProjectImages.vue";
import Information from "@/components/Project/Project/ProjectInformation.vue";
import Results from "@/components/Project/Project/ProjectSandboxes.vue";

const router = useRouter();
const project = router.currentRoute.value.params.project;

const breadcrumbHome = { to: "/project/overview", label: "Projects" };
const breadcrumbCurrent = { label: project };
</script>

<template>
  <Toast />
  <BreadcrumbNavigation :home="breadcrumbHome" :current="breadcrumbCurrent" />
  <div
    class="rounded-lg bg-white p-5 shadow-md dark:border dark:border-gray-700 dark:bg-zinc-800"
  >
    <TabView
      :pt="{
        root: { class: 'dark:!bg-zinc-800' },
        navContainer: { class: 'dark:!bg-zinc-800' },
        navContent: { class: 'dark:!bg-zinc-800' },
        nav: { class: 'dark:!bg-zinc-800' },
        panelContainer: { class: 'dark:!bg-zinc-800' },
      }"
    >
      <TabPanel
        header="Results"
        :pt="{
          root: { class: 'dark:!bg-zinc-800' },
          header: { class: 'dark:!bg-zinc-800' },
          headerAction: { class: 'dark:!bg-zinc-800 dark:!text-blue-500' },
          headerTitle: { class: 'dark:!bg-zinc-800 dark:!text-white' },
          content: { class: 'dark:!bg-zinc-800' },
        }"
      >
        <Results />
      </TabPanel>
      <TabPanel
        header="Images"
        :pt="{
          root: { class: 'dark:!bg-zinc-800' },
          header: { class: 'dark:!bg-zinc-800' },
          headerAction: { class: 'dark:!bg-zinc-800 dark:!text-blue-500' },
          headerTitle: { class: 'dark:!bg-zinc-800 dark:!text-white' },
          content: { class: 'dark:!bg-zinc-800' },
        }"
      >
        <Images />
      </TabPanel>
      <TabPanel
        header="Information"
        :pt="{
          root: { class: 'dark:!bg-zinc-800' },
          header: { class: 'dark:!bg-zinc-800' },
          headerAction: { class: 'dark:!bg-zinc-800 dark:!text-blue-500' },
          headerTitle: { class: 'dark:!bg-zinc-800 dark:!text-white' },
          content: { class: 'dark:!bg-zinc-800' },
        }"
      >
        <Information />
      </TabPanel>
    </TabView>
  </div>
</template>
