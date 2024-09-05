<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { restructureRights, destructureRights } from "@/utils/rights";
import SharedEntity from "@/components/Sharing/SharedEntity.vue";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const data = ref();

const sharedUsers: Ref<ISharedEntity[]> = ref([]);
const allUsers = ref();
const selectedUser = ref();
const filteredUsers = ref();
const userRefs: Ref<(typeof SharedEntity)[]> = ref([]);

const availableUsers = computed(() => {
  if(sharedUsers.value && allUsers.value){
    const usedUsers = sharedUsers.value.map(user => user.name);
    return allUsers.value.filter(user => !usedUsers.includes(user.login))
  }else{
    return []
  }
})

const sharedGroups: Ref<ISharedEntity[]> = ref([]);
const allGroups = ref();
const selectedGroup = ref();
const filteredGroups = ref();
const groupRefs: Ref<(typeof SharedEntity)[]> = ref([]);

const availableGroups = computed(() => {
  if(sharedGroups.value && allGroups.value){
    const usedGroups = sharedGroups.value.map(group => group.name);
    return allGroups.value.filter(group => !usedGroups.includes(group.label))
  }else{
    return []
  }
})

interface ISharedEntity {
  name: string;
  role: string;
}

const generalRole = ref();
const generalOptions = ref([
  {
    name: "No general access",
    value: null,
  },
  {
    name: "Anyone can view",
    value: "read",
  },
  {
    name: "Anyone can edit",
    value: "write",
  },
  {
    name: "Anyone is admin",
    value: "admin",
  },
]);

onMounted(async () => {
  useCustomFetch(
    `/repository/container/security?id=${dialogRef?.value.data.id}`,
  )
    .get()
    .json()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value);
      } else {
        data.value = response.data.value;
        generalRole.value = generalOptions.value.find((option) => {
          return option.value === response.data.value.security.other;
        });
        sharedUsers.value = response.data.value.security.users
          ? destructureRights(response.data.value.security.users)
          : [];
        console.log(sharedUsers.value)
        sharedGroups.value = response.data.value.security.groups
          ? destructureRights(response.data.value.security.groups)
          : [];
      }
    });
});

await useCustomFetch(`/administration/security/user/list`)
  .get()
  .json()
  .then((response) => {
    if (response.error.value) {
      console.log(response.error.value);
    } else {
      allUsers.value = response.data.value;
      console.log(allUsers.value)
    }
  });
await useCustomFetch(`/administration/security/group/list`)
  .get()
  .json()
  .then((response) => {
    if (response.error.value) {
      console.log(response.error.value);
    } else {
      allGroups.value = response.data.value;
    }
  });

const searchUser = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredUsers.value = [...availableUsers.value];
    } else {
      filteredUsers.value = availableUsers.value.filter((user) => {
        return (
          user.login.toLowerCase().startsWith(event.query.toLowerCase()) ||
          user.name.toLowerCase().includes(event.query.toLowerCase())
        );
      });
    }
  }, 250);
};

const searchGroup = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredGroups.value = [...availableGroups.value];
    } else {
      filteredGroups.value = availableGroups.value.filter((group) => {
        return (
          group.label.toLowerCase().startsWith(event.query.toLowerCase()) ||
          group.name.toLowerCase().includes(event.query.toLowerCase())
        );
      });
    }
  }, 250);
};

function getUserName(login: string): string {
  const entry = allUsers.value.find((user) => {
    return user.login === login;
  });
  if(entry){
    return entry.name
  }else{
    return "Deleted User"
  }
}

function getGroupName(label: string): string {
  const entry = allGroups.value.find((group) => {
    return group.label === label;
  });
  if(entry){
    return entry.name
  }else{
    return "Deleted Group"
  }
}

function addUser() {
  sharedUsers.value.push({
    name: selectedUser.value.login,
    role: "read",
  });
  selectedUser.value = null;
}

function addGroup() {
  sharedGroups.value.push({
    name: selectedGroup.value.label,
    role: "read",
  });
  selectedGroup.value = null;
}

function removeShare(type: string, id: string) {
  switch (type) {
    case "user":
      sharedUsers.value = sharedUsers.value.filter(function (user) {
        return user.name !== id;
      });
      break;
    case "group":
      sharedGroups.value = sharedGroups.value.filter(function (group) {
        return group.name !== id;
      });
      break;
  }
}

async function save() {
  const payload = {
    users: restructureRights(userRefs.value.map((userRef) => userRef.get())),
    groups: restructureRights(
      groupRefs.value.map((groupRef) => groupRef.get()),
    ),
    other: generalRole.value.value,
  };
  useCustomFetch(
    `/repository/container/security/update?id=${dialogRef?.value.data.id}`,
  )
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value);
      } else {
        dialogRef?.value.close();
      }
    });
}
</script>
<template>
  <div class="mx-4">
    <div class="my-4 flex flex-col space-y-4">
      <p class="text-xl font-bold">People with access</p>
      <AutoComplete
        v-model="selectedUser"
        option-label="name"
        dropdown
        forceSelection
        @option-select="addUser"
        placeholder="Add other users to collaborate with"
        input-id="users"
        class="col-span-4"
        style="width: 100%"
        :suggestions="filteredUsers"
        @complete="searchUser"
      >
        <template #option="slotProps">
          <div class="flex items-center gap-x-2">
            <AvatarInitials :name="slotProps.option.name" :admin="false" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </AutoComplete>
      <div class="flex flex-col space-y-4">
        <SharedEntity
          v-for="user of sharedUsers"
          :id="user.name"
          :key="user.role"
          ref="userRefs"
          :label="getUserName(user.name)"
          type="user"
          :right="user.role"
          @remove="removeShare"
        />
        <div v-show="sharedUsers.length === 0">
          <p>No users added yet</p>
        </div>
      </div>
    </div>
    <div class="my-10 flex flex-col space-y-2">
      <p class="text-xl font-bold">Groups with access</p>
      <AutoComplete
        v-model="selectedGroup"
        option-label="name"
        dropdown
        forceSelection
        @option-select="addGroup"
        placeholder="Add other groups to collaborate with"
        input-id="users"
        class="col-span-4"
        style="width: 100%"
        :suggestions="filteredGroups"
        @complete="searchGroup"
      >
        <template #option="slotProps">
          <div class="flex items-center gap-x-2">
            <AvatarInitials :name="slotProps.option.name" :admin="false" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </AutoComplete>
      <SharedEntity
        v-for="group of sharedGroups"
        :id="group.name"
        :key="group.role"
        ref="groupRefs"
        :label="getGroupName(group.name)"
        type="group"
        :right="group.role"
        @remove="removeShare"
      />
      <div v-show="sharedGroups.length === 0">
        <p>No groups added yet</p>
      </div>
    </div>
    <div class="my-10 flex flex-col space-y-2">
      <p class="text-xl font-bold">General access</p>
      <div class="flex items-center space-x-2">
        <i
          class="pi pi-share-alt rounded-full bg-surface-100 p-4 text-surface-800"
        />
        <Select
          v-model="generalRole"
          :options="generalOptions"
          option-label="name"
          placeholder="Select Rights"
          class="w-full"
        ></Select>
      </div>
    </div>
    <div class="flex justify-end space-x-2">
      <Button severity="secondary" label="Cancel" @click="dialogRef?.close()" />
      <Button @click="save">
        <p class="text-white">Save</p>
      </Button>
    </div>
  </div>
</template>
<style>
.p-inputtext {
  width: 100%;
}
</style>
