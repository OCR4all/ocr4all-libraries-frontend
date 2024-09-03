<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import { profileSchema } from "@/components/Admin/UserManagement/Dialog/EditUserDialog/Schemas/profileSchema";
import { passwordSchema } from "@/components/Admin/UserManagement/Dialog/EditUserDialog/Schemas/passwordSchema";
import { groupSchema } from "@/components/Admin/UserManagement/Dialog/EditUserDialog/Schemas/groupSchema";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const profileForm = ref();
const passwordForm = ref();
const groupForm = ref();

const profileData = ref();
const passwordData = ref();
const groupData = ref();

onMounted(() => {
  profileData.value = {
    login: dialogRef?.value.data.login,
    state: dialogRef?.value.data.state,
    email: dialogRef?.value.data.email,
    name: dialogRef?.value.data.name,
  }
  groupData.value = dialogRef?.value.data.groups;
});

async function submitProfileChanges(values, { setErrors }) {
  const payload = {
    login: profileData.value.login,
    state: profileData.value.state,
    email: profileData.value.email,
    name: profileData.value.name,
  };
  useCustomFetch(`/administration/security/user/update`)
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        dialogRef?.value.close();
      }
    });
}

function submitPasswordChange(values, { setErrors }) {
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
      if (response.error.value) {
        setErrors(["Something went wrong.", "Please try again later."]);
      } else {
        dialogRef?.value.close();
      }
    });
}

function submitGroupChange() {}
</script>
<template>
  <Tabs value="profile">
    <TabList>
      <Tab value="profile">Profile</Tab>
      <Tab value="password">Password</Tab>
<!--      <Tab value="groups">Groups</Tab>-->
    </TabList>
    <TabPanels>
      <TabPanel value="profile">
        <FormKit
          id="profileForm"
          ref="profileForm"
          v-model="profileData"
          type="form"
          :submit-attrs="{
            inputClass: 'formkit-submit-btn',
          }"
          @submit="submitProfileChanges"
        >
          <FormKitSchema :schema="profileSchema" :data="profileData" />
        </FormKit>
      </TabPanel>
      <TabPanel value="password">
        <FormKit
          id="passwordForm"
          ref="passwordForm"
          v-model="passwordData"
          type="form"
          :submit-attrs="{
            inputClass: 'formkit-submit-btn',
          }"
          @submit="submitPasswordChange"
        >
          <FormKitSchema :schema="passwordSchema" :data="passwordData" />
        </FormKit>
      </TabPanel>
<!--      <TabPanel value="groups">-->
<!--        <FormKit-->
<!--          id="groupForm"-->
<!--          ref="groupForm"-->
<!--          v-model="groupData"-->
<!--          type="form"-->
<!--          :submit-attrs="{-->
<!--            inputClass: 'formkit-submit-btn',-->
<!--          }"-->
<!--          @submit="submitGroupChange"-->
<!--        >-->
<!--          <FormKitSchema :schema="groupSchema" :data="groupData" />-->
<!--        </FormKit>-->
<!--      </TabPanel>-->
    </TabPanels>
  </Tabs>
</template>
