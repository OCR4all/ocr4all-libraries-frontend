<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
</script>

<template>
  <AppLayout>
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="mx-auto text-center">
        <h1
          class="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl"
        >
          404
        </h1>
        <p
          class="mb-4 text-3xl font-bold tracking-tight text-surface-900 dark:text-white md:text-4xl"
        >
          Page not found
        </p>
        <p class="mb-4 text-lg font-light text-surface-500 dark:text-surface-400">
          Sorry, we can't find that page. You'll find lots to explore on the
          <router-link to="/">Dashboard.</router-link>
        </p>
      </div>
    </div>
  </AppLayout>
</template>
