<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore()
</script>

<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>
