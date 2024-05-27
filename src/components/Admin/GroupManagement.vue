<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const groups = ref();

useCustomFetch(`/job/overview/administration`)
  .get()
  .json()
  .then((response) => console.log(response.data.value));

async function refetch() {
  useCustomFetch(`/administration/security/group/list`)
    .json()
    .then((response) => {
      groups.value = response.data.value;
    });
}
refetch();
</script>
<template>
  {{ groups }}
</template>
