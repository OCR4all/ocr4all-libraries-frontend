import { useCustomFetch } from "@/composables/useCustomFetch";

const groups = ref()

await useCustomFetch(`/administration/security/group/list`)
  .json()
  .then((response) => {
    groups.value = response.data.value;
  })

