w
<script setup lang="ts">
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";

const props = defineProps<{
  name?: string;
  thumb?: string;
  img?: string;
  format?: string;
  size?: object;
}>();
</script>
<template>
  <div class="grid grid-cols-1 justify-self-center">
    <div
      class="shadow-xs group relative m-2 grid h-64 w-64 bg-surface-100 bg-clip-border text-surface-700 hover:bg-primary-200 dark:bg-surface-950 hover:dark:bg-surface-700"
    >
      <div
        class="mx-4 mt-4 h-fit w-fit self-center justify-self-center text-surface-700"
      >
        <Image v-if="props.img" alt="Image" preview>
          <template #indicatoricon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img
              :src="props.thumb"
              class="max-w-48 max-h-48 object-scale-down"
              alt="image"
            />
          </template>
          <template #preview="slotProps">
            <img
              :src="props.img"
              alt="preview"
              class="max-h-screen"
              :style="slotProps.style"
              @click="slotProps.onClick"
            />
          </template>
        </Image>
        <Skeleton v-else animation="wave" size="10rem"></Skeleton>
      </div>
    </div>
    <div class="mx-4 mb-4">
      <p class="font-semibold text-black dark:text-white">{{ props.name }}</p>
      <p class="font-light text-surface-600 dark:text-surface-300">
        {{ props.format }} · {{ props.size.width }}x{{ props.size.height }}
      </p>
    </div>
  </div>
</template>
