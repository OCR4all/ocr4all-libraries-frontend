<script async setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { restructureRights, destructureRights } from "@/utils/rights";

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
        sharedUsers.value = response.data.value.security.users ? destructureRights(response.data.value.security.users) : null
        sharedGroups.value = response.data.value.security.groups ? destructureRights(response.data.value.security.groups) : null
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
        console.log(allUsers.value)
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

const options = ref([
  {
    name: "Can Read",
    label: "read"
  },
  {
    name: "Can Write",
    label: "write"
  },
  {
    name: "Admin",
    label: "admin"
  }
])

const val = ref()


function getRealName(login: string): string {
  console.log(login)
  const entry = allUsers.value.find(user => {
    return user.login === login
  })
  console.log(entry)
  console.log(entry.name)
  return entry.name
}
</script>
<template>
  <div class="grid grid-cols-5 gap-x-2">
    <AutoComplete
        v-model="selectedUsers"
        option-label="name"
        placeholder="Add other users or groups to collaborate with"
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
    <Button icon="pi pi-plus" severity="primary" aria-label="Add" />
  </div>
  <div class="flex flex-col space-y-2 my-10">
    <p class="text-xl font-bold">People with access</p>
    <div v-for="user of sharedUsers" :key="user.targets" class="flex justify-between">
      <div class="flex items-center gap-x-2">
        <Button text>
          <i class="pi pi-times text-surface-800 hover:text-surface-950 dark:text-surface-200 dark:hover:text-surface-0" />
        </Button>
        <AvatarInitials :name="getRealName(user.name)" :admin="false" :selectable="false" size="lg" />
        <div class="flex flex-col -space-y-0.5">
          <p class="font-bold">{{ getRealName(user.name) }}</p>
          <p>{{ user.name }}</p>
        </div>
      </div>
      <div>
        <Select v-model="val" :options="options" optionLabel="name" placeholder="Select Rights" class="w-full" />
      </div>
    </div>
    <div v-show="!sharedUsers">
      <p>No users added yet</p>
    </div>
  </div>
  <div class="flex flex-col space-y-2 my-10">
    <p class="text-xl font-bold">Groups with access</p>
    <div v-for="user of sharedGroups" :key="user.targets" class="flex justify-between">
      <div class="flex items-center gap-x-2">
        <Button text>
          <i class="pi pi-times text-surface-800 hover:text-surface-950 dark:text-surface-200 dark:hover:text-surface-0" />
        </Button>
        <AvatarInitials :name="getRealName(user.name)" :admin="false" :selectable="false" size="lg" />
        <div class="flex flex-col -space-y-0.5">
          <p class="font-bold">{{ getRealName(user.name) }}</p>
          <p>{{ user.name }}</p>
        </div>
      </div>
      <div>
        <Select v-model="val" :options="options" optionLabel="name" placeholder="Select Rights" class="w-full" />
      </div>
    </div>
    <div v-show="!sharedUsers">
      <p>No groups added yet</p>
    </div>
  </div>
  <pre>
    {{ data }}
  </pre>
</template>
<style>
.p-inputtext {
  width: 100%
}
</style>
