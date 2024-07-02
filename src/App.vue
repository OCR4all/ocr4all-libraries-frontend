<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
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
