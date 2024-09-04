<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useCustomFetch } from "@/composables/useCustomFetch";

import IconFlipHorizontal from "~icons/fluent/flip-horizontal-24-regular";
import IconFlipVertical from "~icons/fluent/flip-vertical-24-filled";
import IconRotateRight from "~icons/fluent/arrow-rotate-clockwise-16-filled";
import IconRotateLeft from "~icons/fluent/arrow-rotate-counterclockwise-24-filled";
import IconSave from "~icons/fluent/save-16-regular";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const image = ref();

const isLoading = ref(true);

onMounted(() => {
  const container = dialogRef?.value.data.container;
  const folio = dialogRef?.value.data.id;

  useCustomFetch(
    `/repository/container/folio/derivative/best/${container}?id=${folio}`,
  )
    .get()
    .blob()
    .then((response) => {
      image.value = {
        src: useObjectUrl(response.data.value),
        type: "image/png",
      };
    });
});

const cropper = ref();

const cropImage = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult();
    const newTab = window.open();
    if (newTab && canvas) {
      newTab.document.body.innerHTML = `<img src="${canvas.toDataURL(
        image.value.type,
      )}"></img>`;
    }
  }
};

function flip(x, y) {
  const { image } = cropper.value.getResult();
  if (image.transforms.rotate % 180 !== 0) {
    cropper.value.flip(!x, !y);
  } else {
    cropper.value.flip(x, y);
  }
}
function rotate(angle) {
  cropper.value.rotate(angle);
}
</script>

<template>
  <div :class="{ isLoading: 'hidden' }">
    <Toolbar>
      <template #start>
        <div class="flex space-x-2">
          <Button
            v-tooltip.top="'Flip horizontally'"
            @click="flip(true, false)"
            text
          >
            <IconFlipHorizontal class="text-black dark:text-white" />
          </Button>
          <Button
            v-tooltip.top="'Flip vertically'"
            @click="flip(false, true)"
            text
          >
            <IconFlipVertical class="text-black dark:text-white" />
          </Button>
          <Button v-tooltip.top="'Rotate clockwise'" @click="rotate(90)" text>
            <IconRotateRight class="text-black dark:text-white" />
          </Button>
          <Button
            v-tooltip.top="'Rotate counter clockwise'"
            @click="rotate(-90)"
            text
          >
            <IconRotateLeft class="text-black dark:text-white" />
          </Button>
        </div>
      </template>

      <template #end>
        <Button v-tooltip.top="'Save'" @click="save" label="Save" text>
          <IconSave class="text-black dark:text-white" />
        </Button>
      </template>
    </Toolbar>
    <Cropper
      v-if="image"
      ref="cropper"
      class="cropper"
      :src="image.src"
      @ready="isLoading = false"
    />
  </div>
  <div v-if="isLoading">
    <Skeleton size="100vh"></Skeleton>
  </div>
</template>

<style>
.cropper {
  max-height: 500px;
}

.button {
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  width: 100%;
  background: #d3d3d3;
  cursor: pointer;
  transition: background 0.5s;
  border: none;
  &:not(:last-of-type) {
    margin-right: 10px;
  }
  &:hover {
    background: #2f2f2f;
  }
  input {
    display: none;
  }
}
</style>
