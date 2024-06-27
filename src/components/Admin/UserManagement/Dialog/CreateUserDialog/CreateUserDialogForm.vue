<script setup lang="ts">
import { userSchema } from "@/components/Admin/UserManagement/Dialog/CreateUserDialog/Schemas/userSchema";

const dialogRef = inject("dialogRef");
import { useCustomFetch } from "@/composables/useCustomFetch";

const schema = userSchema;
const data = ref();

function createUser(values, { setErrors }) {
  const payload = {
    login: data.value.login,
    state: data.value.state,
    email: data.value.email,
    name: data.value.name,
    password: data.value.password,
  };
  useCustomFetch(`/administration/security/user/create`)
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
    id="form"
    v-model="data"
    type="form"
    :submit-attrs="{
      inputClass: 'p-button p-component',
    }"
    @submit="createUser"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
