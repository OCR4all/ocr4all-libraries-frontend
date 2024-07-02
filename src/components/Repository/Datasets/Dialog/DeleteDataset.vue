<script setup lang="ts">
const dialogRef = inject("dialogRef");
import { useCustomFetch } from "@/composables/useCustomFetch";

const data = ref();

function deleteDataset(values, { setErrors }) {
  const payload = {
    name: data.value.name,
    description: data.value.description,
    keywords: data.value.keywords,
  };
  useCustomFetch(`/data/collection/create`)
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        dialogRef.value.close();
      }
    });
}
</script>
<template>

</template>
