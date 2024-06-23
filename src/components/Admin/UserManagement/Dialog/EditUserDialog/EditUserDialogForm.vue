<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import { profileSchema } from "@/components/Admin/UserManagement/Dialog/EditUserDialog/Schemas/profileSchema"
import { passwordSchema } from "@/components/Admin/UserManagement/Dialog/EditUserDialog/Schemas/passwordSchema"

const dialogRef = inject('dialogRef');

const profileForm = ref()
const passwordForm = ref()

const profileData = ref();
const passwordData = ref()
const groupData = ref()

onMounted(() => {
  profileData.value = dialogRef.value.data.data
})

async function submitProfileChanges(values, { setErrors }){
  const payload = {
    login: profileData.value.login,
    state: profileData.value.state,
    email: profileData.value.email,
    name: profileData.value.name,
  };
  useCustomFetch(`/administration/security/user/update`)
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

function submitPasswordChange(values, { setErrors }){
  const payload = {
    login: profileData.value.login,
    state: profileData.value.state,
    email: profileData.value.email,
    name: profileData.value.name,
    password: passwordData.value.password,
  };
  useCustomFetch(`/administration/security/user/update`)
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
  <Tabs value="0">
    <TabList>
      <Tab value="profile">Profile</Tab>
      <Tab value="password">Password</Tab>
      <Tab disabled value="groups">Groups</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="profile">
        <FormKit
          id="form"
          ref="profileForm"
          v-model="profileData"
          type="form"
          :submit-attrs="{
      inputClass: 'p-button p-component',
    }"
          @submit="submitProfileChanges"
        >
          <FormKitSchema :schema="profileSchema" :data="profileData" />
        </FormKit>
      </TabPanel>
      <TabPanel value="password">
        <FormKit
          id="form"
          ref="passwordForm"
          v-model="passwordData"
          type="form"
          :submit-attrs="{
      inputClass: 'p-button p-component',
    }"
          @submit="submitPasswordChange"
        >
          <FormKitSchema :schema="passwordSchema" :data="passwordData" />
        </FormKit>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>