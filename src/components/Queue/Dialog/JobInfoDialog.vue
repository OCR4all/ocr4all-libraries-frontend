<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const dialogRef = inject("dialogRef");

const data = ref()

onMounted(() => {
  useCustomFetch(
    `/job/entity/${dialogRef.value.data.id}`,
  ).get().json().then((response) => {
    data.value = response.data.value
    console.log(data.value)
  });
});
</script>
<template>
{{ data }}
</template>
