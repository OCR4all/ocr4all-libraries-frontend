<script setup lang="ts">
const dialogRef = inject("dialogRef");

const data = ref()

onMounted(() => {
  data.value = dialogRef.value.data;
});
</script>
<template>
  {{ data }}
</template>
