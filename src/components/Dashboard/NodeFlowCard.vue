<script setup lang="ts">
const router = useRouter();
</script>
<template>
  <div
    class="group flex flex-col justify-between bg-white p-5 shadow-md hover:cursor-pointer hover:bg-blue-700 dark:bg-zinc-800 hover:dark:bg-blue-800 xl:flex-row"
    @click="router.push('/nodeflow')"
  >
    <div class="my-auto">
      <slot name="icon"></slot>
    </div>
    <div class="my-auto flex flex-col space-y-1">
      <div
        class="text-center text-xl text-gray-600 group-hover:text-gray-100 dark:text-gray-300 xl:text-end"
      >
        <slot name="subtitle"></slot>
      </div>
      <div
        class="text-center text-2xl font-bold text-gray-800 group-hover:text-white dark:text-white xl:text-end"
      >
        <slot name="title"></slot>
      </div>
    </div>
  </div>
</template>
