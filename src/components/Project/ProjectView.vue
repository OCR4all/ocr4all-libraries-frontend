<script setup lang="ts">
import Toast from "primevue/toast";

import Images from "@/components/Project/Project/ProjectImages.vue";
import Information from "@/components/Project/Project/ProjectInformation.vue";
import Results from "@/components/Project/Project/ProjectSandboxes.vue";
import { useUiStore } from "@/stores/ui.store";
import SelectButton from "primevue/selectbutton";

const category = ref("Results");
const options = ref(["Results", "Images", "Information"]);

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

useHead({
  title: project,
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <Toast />
  <div class="flex flex-col gap-y-6">
    <div class="flex justify-center">
      <SelectButton
        v-model="category"
        :options="options"
        aria-labelledby="basic"
      />
    </div>
    <div v-auto-animate>
      <Results v-if="category === 'Results'" />
      <Images v-else-if="category === 'Images'" />
      <Information v-else-if="category === 'Information'" />
    </div>
  </div>
</template>
