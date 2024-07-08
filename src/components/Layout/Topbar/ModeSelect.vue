<script setup lang="ts">
const selectedMode =ref()
const modes = ref(["base", "experimental"])
</script>
<template>
  <Select v-model="selectedMode" :options="modes" optionLabel="name" placeholder="Select a Country" class="w-full md:w-56">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
        <div>{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
            {{ slotProps.placeholder }}
        </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Select>
</template>
