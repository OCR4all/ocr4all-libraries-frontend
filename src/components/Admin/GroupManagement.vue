<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const groups = ref();

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
