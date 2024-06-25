<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import { groupSchema } from "@/components/Admin/GroupManagement/Dialog/EditGroupDialog/Schemas/groupSchema"

const dialogRef = inject('dialogRef');

const groupForm = ref()
const data = ref()

const schema = groupSchema


onMounted(() => {
  data.value = dialogRef.value.data.data
  data.value.users = data.value.users.map(user => user.login)
})

async function submitGroupChanges(values, { setErrors }){
  const payload = {
    label: data.value.label,
    state: data.value.state,
    name: data.value.name,
    users: data.value.users,
  };
  useCustomFetch(`/administration/security/group/update`)
    .post(payload)
    .then((response) => {
      if(response.error.value){
        setErrors(
          ['Something went wrong.', 'Please try again later.']
        )
      }else{
        dialogRef.value.close()
      }
    });
}
</script>
<template>
    <FormKit
      id="groupForm"
      ref="groupForm"
      v-model="data"
      type="form"
      :submit-attrs="{
  inputClass: 'p-button p-component',
}"
      @submit="submitGroupChanges"
    >
      <FormKitSchema :schema="schema" :data="data" />
    </FormKit>
</template>
