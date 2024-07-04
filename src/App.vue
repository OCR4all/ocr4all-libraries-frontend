<script setup lang="ts">
import {setPrimaryColorsFromStorage} from "@/utils/colors";

setPrimaryColorsFromStorage()
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
