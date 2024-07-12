<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const dialogRef = inject("dialogRef");

const data = ref();

const sharedUsers = ref()
const allUsers = ref()
const selectedUsers = ref()
const filteredUsers = ref()

const sharedGroups = ref()
const allGroups = ref()
const selectedGroups = ref()
const filteredGroups = ref()

onMounted(() => {
  useCustomFetch(`/repository/container/security?id=${dialogRef.value.data.id}`)
    .get()
    .json()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value)
      } else {
        data.value = response.data.value
      }
    });
  useCustomFetch(`/administration/security/user/list`)
    .get()
    .json()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value)
      } else {
        allUsers.value = response.data.value
      }
    });
  useCustomFetch(`/administration/security/group/list`)
    .get()
    .json()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value)
      } else {
        allGroups.value = response.data.value
      }
    });
});

const searchUser = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredUsers.value = [...allUsers.value];
    } else {
      filteredUsers.value = allUsers.value.filter((user) => {
        console.log(user)
        return user.login.toLowerCase().startsWith(event.query.toLowerCase()) || user.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}

const searchGroup = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredGroups.value = [...allGroups.value];
    } else {
      filteredGroups.value = allGroups.value.filter((group) => {
        return group.label.toLowerCase().startsWith(event.query.toLowerCase()) || group.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}
</script>
<template>
  <p>Add other users or groups to collaborate on this container</p>
  <div class="flex gap-x-2">
    <AutoComplete v-model="selectedUsers" option-label="name" placeholder="Add a user" input-id="users" :suggestions="filteredUsers" @complete="searchUser">
      <template #option="slotProps">
        <div class="flex items-center gap-x-2">
          <AvatarInitials :name="slotProps.option.name" :admin="false" />
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </AutoComplete>
    <Button label="Add" />
  </div>
  <p>8 Users</p>
  <div class="flex gap-x-2">
    <AutoComplete v-model="selectedGroups" option-label="name" placeholder="Add a group" input-id="groups" :suggestions="filteredGroups" @complete="searchGroup">
      <template #option="slotProps">
        <div class="flex items-center">
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </AutoComplete>
    <Button label="Add" />
  </div>
  <pre>
    {{ data }}
  </pre>
</template>
