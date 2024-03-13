<template>
  <div
    class="group rounded-md bg-white p-5 shadow-sm hover:bg-primary-600 hover:shadow-md hover:shadow-primary-600/30 dark:bg-surface-800 hover:dark:bg-primary-600"
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
