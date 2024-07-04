<script setup lang="ts">
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
