<template>
  <div
    class="group rounded-md border bg-white p-5 hover:bg-primary-600 dark:border-surface-700 dark:bg-surface-850 hover:dark:bg-primary-600"
  >
    <div
      class="text-base text-surface-400 group-hover:text-white dark:text-surface-300"
    >
      <slot name="title"></slot>
    </div>
    <div class="flex items-center pt-1">
      <div
        class="text-2xl font-bold text-surface-900 group-hover:text-white dark:text-surface-100"
      >
        <slot name="value"></slot>
      </div>
    </div>
  </div>
</template>
