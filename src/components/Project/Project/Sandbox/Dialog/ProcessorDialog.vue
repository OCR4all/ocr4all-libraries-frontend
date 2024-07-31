<script setup lang="ts">
import {Ref} from "vue";

const dialogRef = inject("dialogRef");

const project: Ref<string | undefined> = ref();
const sandbox: Ref<string | undefined> = ref();
const track: Ref<number[] | undefined> = ref();

onMounted(() => {
  project.value = dialogRef.value.data.project;
  sandbox.value = dialogRef.value.data.sandbox;
  track.value = dialogRef.value.data.track;
});
</script>
<template>
  <ProcessorSelector @close="dialogRef.close()" :project="project" :sandbox="sandbox" :track="track" />
</template>
