<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Toolbar from "primevue/toolbar";
import ImageCard from "@/components/Project/Project/ImageCard.vue";
import IconImageImport from "~icons/lucide/image-plus";
import IconRefresh from "~icons/heroicons/arrow-path";
import { useDialog } from "primevue/usedialog";

const projectImageImportDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Dialog/ProjectImageImportDialog.vue"),
);

const dialog = useDialog();
const router = useRouter();
const project = router.currentRoute.value.params.project;

const isRefetching = ref(true)

const folios = ref([]);
async function refresh() {
  isRefetching.value = true
  const folioData = await useCustomFetch(`/project/folio/list/${project}`)
    .get()
    .json();
  isRefetching.value = false
  folios.value = folioData.data.value;
}

function openImageImportDialog() {
  dialog.open(projectImageImportDialog, {
    props: {
      header: "Import Images",
      modal: true,
      maximizable: true,
      maximizeIcon: "pi pi-window-maximize",
      style: {
        width: "70vw",
      },
      breakpoints: {
        "960px": "80vw",
        "640px": "90vw",
      },
    },
    data: project,
    onClose: () => {
      refresh();
    },
  });
}

refresh();
</script>
<template>
  <ComponentContainer spaced>
    <Toolbar class="mb-4">
      <template #start>
        <Button
          v-tooltip.top="'Import Images'"
          text
          @click="openImageImportDialog"
        >
          <IconImageImport
            class="text-black dark:text-white"
            :class="{ 'animate-pulse': folios.length === 0 }"
          />
        </Button>
      </template>
      <template #end>
        <button
          v-tooltip.left="'Refresh'"
          :disabled="isRefetching === true"
          @click="refresh"
        >
          <IconRefresh
            :class="{ 'animate-spin': isRefetching }"
            class="mr-2 h-6 w-6 text-surface-500 hover:text-black dark:text-surface-200 dark:hover:text-white"
          />
        </button>
      </template>
    </Toolbar>
    <div
      v-if="folios.length"
      class="grid grid-cols-1 justify-between gap-x-2 gap-y-3 @[700px]/content:grid-cols-2 @[1100px]/content:grid-cols-3 @[1300px]/content:grid-cols-4"
    >
      <ImageCard
        v-for="folio in folios"
        :id="folio.id"
        :key="folio.id"
        :name="folio.name"
        :size="folio.size"
        :format="folio.format"
        :projectId="project"
      />
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center dark:text-surface-100"
    >
      {{ $t("pages.projects.project.images.no-images") }}
    </div>
  </ComponentContainer>
</template>
