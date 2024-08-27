<script setup lang="ts">
import { setPrimaryColorsFromStorage } from "@/utils/colors";
import {setFontSizeFromStorage} from "@/utils/a11n";

setPrimaryColorsFromStorage();
setFontSizeFromStorage()
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
