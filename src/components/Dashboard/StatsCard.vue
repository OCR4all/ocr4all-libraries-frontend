<template>
  <div
    class="group rounded-md border border-surface-200 bg-white p-5 hover:bg-primary-600 dark:border-surface-800 dark:bg-surface-900 hover:dark:bg-primary-600"
  >
    <div
      class="text-base text-surface-800 group-hover:text-white dark:text-surface-200"
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
