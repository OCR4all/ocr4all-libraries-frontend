<template>
  <div
    class="group bg-white p-5 shadow-md hover:bg-blue-700 dark:bg-zinc-800 hover:dark:bg-blue-800"
  >
    <div
      class="text-base text-gray-400 group-hover:text-white dark:text-gray-300"
    >
      <slot name="title"></slot>
    </div>
    <div class="flex items-center pt-1">
      <div
        class="text-2xl font-bold text-gray-900 group-hover:text-white dark:text-gray-100"
      >
        <slot name="value"></slot>
      </div>
    </div>
  </div>
</template>
