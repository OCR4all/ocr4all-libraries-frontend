<template>
  <div
    class="group flex h-full flex-1 flex-col justify-center rounded-xl bg-white p-5 shadow-md hover:bg-blue-700 dark:bg-zinc-800 hover:dark:bg-blue-800"
  >
    <div class="flex flex-col">
      <div>
        <slot name="icon"></slot>
      </div>
      <div
        class="truncate pt-8 text-center text-lg font-bold text-gray-900 group-hover:text-white dark:text-gray-100"
      >
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>
