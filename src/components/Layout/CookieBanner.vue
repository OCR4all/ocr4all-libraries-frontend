<script setup lang="ts"></script>
<template>
  <section
    class="fixed bottom-16 left-12 mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800"
  >
    <h2 class="font-semibold text-surface-800 dark:text-white">
      🍪 Cookie Notice
    </h2>

    <p class="mt-4 text-sm text-surface-600 dark:text-surface-300">
      We use cookies to ensure that we give you the best experience on our
      website.
      <a href="#" class="text-blue-500 hover:underline">Read cookies policies</a
      >.
    </p>

    <div class="mt-4 flex shrink-0 items-center justify-between gap-x-4">
      <button
        class="text-xs text-surface-800 underline transition-colors duration-300 hover:text-surface-600 focus:outline-none dark:text-white dark:hover:text-surface-400"
      >
        Manage your preferences
      </button>

      <button
        class="rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-primary-900 focus:outline-none dark:bg-primary-600"
      >
        Accept
      </button>
    </div>
  </section>
</template>
