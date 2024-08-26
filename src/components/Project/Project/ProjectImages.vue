<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import Toolbar from "primevue/toolbar";
import ImageCard from "@/components/Project/Project/ImageCard.vue";
import IconImageImport from "~icons/lucide/image-plus";
import { useDialog } from "primevue/usedialog";

const projectImageImportDialog = defineAsyncComponent(
  () =>
    import("@/components/Project/Project/Dialog/ProjectImageImportDialog.vue"),
);

const dialog = useDialog()
const router = useRouter();
const project = router.currentRoute.value.params.project;

const folios = ref([]);
async function refresh() {
  const folioData = await useCustomFetch(`/project/folio/list/${project}`)
    .get()
    .json();

  if(folioData.data.value){
    for (const folio of folioData.data.value) {
      await fetchImages(folio);
    }
  }
}

async function fetchImages(folio) {
  const thumbnailBlob = await useCustomFetch(
    `/project/folio/derivative/thumbnail/${project}?id=${folio.id}`,
  )
    .get()
    .blob();
  const thumbnail = useObjectUrl(thumbnailBlob.data.value);

  const imageBlob = await useCustomFetch(
    `/project/folio/derivative/best/${project}?id=${folio.id}`,
  )
    .get()
    .blob();
  const image = useObjectUrl(imageBlob.data.value);
  folios.value.push({
    name: folio.name,
    id: folio.id,
    size: folio.size,
    format: folio.format,
    img: image,
    thumbnail: thumbnail,
  });
}

function openImageImportDialog(){
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
  <div class="@container/section">
    <ComponentContainer spaced>
      <Toolbar class="mb-4">
        <template #start>
          <Button
            v-tooltip.top="'Import Images'"
            text
            @click="openImageImportDialog"
          >
            <IconImageImport class="text-black dark:text-white" :class="{ 'animate-pulse' : folios.length === 0 }" />
          </Button>
        </template>
      </Toolbar>
      <div
        v-if="folios.length"
        class="grid grid-cols-1 justify-between gap-x-2 gap-y-3 @[550px]/section:grid-cols-2 @[800px]/section:grid-cols-3 @[1050px]/section:grid-cols-4"
      >
        <ImageCard
          v-for="folio in folios"
          :key="folio.id"
          :name="folio.name"
          :thumb="folio.thumbnail"
          :img="folio.img"
          :size="folio.size"
          :format="folio.format"
        />
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center dark:text-surface-100"
      >
        {{ $t("pages.projects.project.images.no-images") }}
      </div>
    </ComponentContainer>
  </div>
</template>
