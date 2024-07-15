<script async setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { restructureRights, destructureRights } from "@/utils/rights";

const dialogRef = inject("dialogRef");

const data = ref();

const sharedUsers: Ref<ISharedEntity[]> = ref([])
const allUsers = ref()
const selectedUser = ref()
const filteredUsers = ref()
const userRefs = ref([])

const sharedGroups: Ref<ISharedEntity[]> = ref([])
const allGroups = ref()
const selectedGroup = ref()
const filteredGroups = ref()
const groupRefs = ref([])

interface ISharedEntity {
  name: string,
  role: string
}

onMounted(() => {
  useCustomFetch(`/repository/container/security?id=${dialogRef.value.data.id}`)
    .get()
    .json()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value)
      } else {
        data.value = response.data.value
        sharedUsers.value = response.data.value.security.users ? destructureRights(response.data.value.security.users) : []
        sharedGroups.value = response.data.value.security.groups ? destructureRights(response.data.value.security.groups) : []
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

function getUserName(login: string): string {
  const entry = allUsers.value.find(user => {
    return user.login === login
  })
  return entry.name
}

function getGroupName(label: string): string {
  const entry = allGroups.value.find(group => {
    return group.label === label
  })
  return entry.name
}

function addUser(){
  sharedUsers.value.push({
    name: selectedUser.value.login,
    role: "read"
  })
}

function addGroup(){
  sharedGroups.value.push({
    name: selectedGroup.value.label,
    role: "read"
  })
}

function removeShare(type: string, id: string){
  switch(type){
    case "user":
      sharedUsers.value = sharedUsers.value.filter(function (user){
      return user.name !== id
    })
      break
    case "group":
      console.log(sharedGroups.value)
      sharedGroups.value = sharedGroups.value.filter(function (group){
        console.log(group.name)
        console.log(id)
        return group.name !== id
      })
      console.log(sharedGroups.value)
      break
  }
}

function save(){
  userRefs.value.forEach((userRef) => {
    console.log(userRef.get())
  })
}
</script>
<template>
  <div class="flex flex-col space-y-2 my-4">
    <p class="text-xl font-bold">People with access</p>
    <div class="grid grid-cols-5 gap-x-2">
      <AutoComplete
        v-model="selectedUser"
        option-label="name"
        placeholder="Add other users to collaborate with"
        input-id="users"
        class="col-span-4"
        style="width: 100%"
        :suggestions="filteredUsers"
        @complete="searchUser">
        <template #option="slotProps">
          <div class="flex items-center gap-x-2">
            <AvatarInitials :name="slotProps.option.name" :admin="false" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </AutoComplete>
      <Button @click="addUser" icon="pi pi-plus" severity="primary" label="Add" aria-label="Add" />
    </div>
    <SharedEntity
      v-for="user of sharedUsers" :key="user.role" ref="userRefs"
      :label="getUserName(user.name)"
      type="user"
      @remove="removeShare"
      :id="user.name"
      :right="user.role" />
    <div v-show="sharedUsers.length === 0">
      <p>No users added yet</p>
    </div>
  </div>
  <div class="flex flex-col space-y-2 my-10">
    <p class="text-xl font-bold">Groups with access</p>
    <div class="grid grid-cols-5 gap-x-2">
      <AutoComplete
        v-model="selectedGroup"
        option-label="name"
        placeholder="Add other groups to collaborate with"
        input-id="users"
        class="col-span-4"
        style="width: 100%"
        :suggestions="filteredGroups"
        @complete="searchGroup">
        <template #option="slotProps">
          <div class="flex items-center gap-x-2">
            <AvatarInitials :name="slotProps.option.name" :admin="false" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </AutoComplete>
      <Button @click="addGroup" icon="pi pi-plus" severity="primary" label="Add" aria-label="Add" />
    </div>
    <SharedEntity
      v-for="group of sharedGroups" :key="group.role" ref="groupRefs"
      :label="getGroupName(group.name)"
      type="group"
      @remove="removeShare"
      :id="group.name"
      :right="group.role" />
    <div v-show="sharedGroups.length === 0">
      <p>No groups added yet</p>
    </div>
  </div>
  <Button @click="save" label="Save" />
  <pre>
    {{ data }}
  </pre>
</template>
<style>
.p-inputtext {
  width: 100%
}
</style>
