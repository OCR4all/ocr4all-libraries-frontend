<script setup lang="ts">
const dialogRef = inject('dialogRef');
const journal = ref()

onMounted(() => {
  journal.value = dialogRef.value.data.journal;
})

</script>
<template>
{{ journal }}
</template>
