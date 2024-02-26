<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const availableProcessors = ref([])
const treeNodes = ref([])

const selectedProcessor = ref()
const processorConfig = ref()

const { data } = await useCustomFetch("/spi/list")
  .get()
  .json()
availableProcessors.value = data.value
/*for(const processor of availableProcessors.value){
  const entry = {
    key: '',
    label: '',
    children: ''
  }
}*/
</script>
<template>
<section v-if="!selectedProcessor">

</section>
<section v-else>
</section>
</template>
