<script setup lang="ts">
import { groupSchema } from "@/components/Admin/GroupManagement/Dialog/CreateGroupDialog/Schemas/groupSchema";

const dialogRef = inject("dialogRef");
import { useCustomFetch } from "@/composables/useCustomFetch";

const schema = groupSchema;
const data = ref();

function createGroup(values, { setErrors }) {
  const payload = {
    label: data.value.label,
    state: data.value.state,
    name: data.value.name,
    users: data.value.users,
  };
  useCustomFetch(`/administration/security/group/create`)
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
  <FormKit
    id="createGroupForm"
    v-model="data"
    type="form"
    :submit-attrs="{
      inputClass: 'p-button p-component',
    }"
    @submit="createGroup"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
