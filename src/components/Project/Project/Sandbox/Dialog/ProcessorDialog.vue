<script setup lang="ts">
const dialogRef = inject('dialogRef');

const project = ref()
const sandbox = ref()
const track = ref()

onMounted(() => {
  project.value = dialogRef.value.data.project;
  sandbox.value = dialogRef.value.data.sandbox;
  track.value = dialogRef.value.data.track;
  console.log(track.value)
})
</script>
<template>
  <ProcessorSelector :project="project" :sandbox="sandbox" :track="track" />
</template>