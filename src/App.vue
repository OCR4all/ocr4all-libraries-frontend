<script setup lang="ts">
import { setPrimaryColorsFromStorage } from "@/utils/colors";
import {setFontFromStorage, setFontSizeFromStorage, setGrayscaleFromStorage} from "@/utils/a11n";

setPrimaryColorsFromStorage();
setFontSizeFromStorage()
setGrayscaleFromStorage()
setFontFromStorage()
</script>

<template>
  <Suspense>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
  </Suspense>
</template>
