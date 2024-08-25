<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { destructureRights, restructureRightsProjects } from "@/utils/rights";
import SharedEntity from "@/components/Sharing/SharedEntity.vue";

const dialogRef = inject<Ref<unknown>>("dialogRef");

const data = ref();

const sharedUsers: Ref<ISharedEntity[]> = ref([]);
const allUsers = ref();
const selectedUser = ref();
const filteredUsers = ref();
const userRefs: Ref<(typeof SharedEntity)[]> = ref([]);

const sharedGroups: Ref<ISharedEntity[]> = ref([]);
const allGroups = ref();
const selectedGroup = ref();
const filteredGroups = ref();
const groupRefs: Ref<(typeof SharedEntity)[]> = ref([]);

interface ISharedEntity {
  name: string;
  role: string;
}

interface IGeneralOption {
  name: string;
  value: boolean;
}

const generalRole: Ref<IGeneralOption[]> = ref([]);
const generalOptions: Ref<IGeneralOption[]> = ref([]);

onMounted(async () => {
  useCustomFetch(`/project/security/information?id=${dialogRef?.value.data.id}`)
    .get()
    .json()
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value);
      } else {
        data.value = response.data.value;
        generalOptions.value = [
          {
            name: "Can Read",
            value: data.value.other.read,
          },
          {
            name: "Can Write",
            value: data.value.other.write,
          },
          {
            name: "Can Execute",
            value: data.value.other.execute,
          },
          {
            name: "Is Admin",
            value: data.value.other.special,
          },
        ];
        sharedUsers.value = data.value.users
          ? destructureRights(data.value.users)
          : [];
        sharedGroups.value = data.value.groups
          ? destructureRights(data.value.groups)
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
      filteredUsers.value = [...allUsers.value];
    } else {
      filteredUsers.value = allUsers.value.filter((user) => {
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
      filteredGroups.value = [...allGroups.value];
    } else {
      filteredGroups.value = allGroups.value.filter((group) => {
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
  return entry.name;
}

function getGroupName(label: string): string {
  const entry = allGroups.value.find((group) => {
    return group.label === label;
  });
  return entry.name;
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
      console.log(sharedGroups.value);
      sharedGroups.value = sharedGroups.value.filter(function (group) {
        console.log(group.name);
        console.log(id);
        return group.name !== id;
      });
      break;
  }
}

async function save() {
  const payload = {
    id: data.value.id,
    users: restructureRightsProjects(
      userRefs.value.map((userRef) => userRef.get()),
    ),
    groups: restructureRightsProjects(
      groupRefs.value.map((groupRef) => groupRef.get()),
    ),
    other: {
      read:
        generalRole.value.find((role) => {
          return role.name === "Can Read";
        })?.value || false,
      write:
        generalRole.value.find((role) => {
          return role.name === "Can Write";
        })?.value || false,
      execute:
        generalRole.value.find((role) => {
          return role.name === "Can Execute";
        })?.value || false,
      special:
        generalRole.value.find((role) => {
          return role.name === "Is Admin";
        })?.value || false,
    },
  };
  console.log(payload);
  useCustomFetch("/project/security/update")
    .post(payload)
    .then((response) => {
      if (response.error.value) {
        console.log(response.error.value);
      } else {
        /*dialogRef?.value.close()*/
      }
    });
}
</script>
<template>
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
        :key="user.role"
        ref="userRefs"
        :label="getUserName(user.name)"
        type="user"
        @remove="removeShare"
        :id="user.name"
        :right="user.role"
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
      :key="group.role"
      ref="groupRefs"
      :label="getGroupName(group.name)"
      type="group"
      @remove="removeShare"
      :id="group.name"
      :right="group.role"
    />
    <div v-show="sharedGroups.length === 0">
      <p>No groups added yet</p>
    </div>
  </div>
  <div class="my-10 flex flex-col space-y-2">
    <p class="text-xl font-bold">General access</p>
    <div class="flex items-center space-x-2">
      <i
        class="pi pi-share-alt rounded-full bg-surface-100 p-4 text-surface-700"
      />
      <MultiSelect
        v-model="generalRole"
        :options="generalOptions"
        optionLabel="name"
        filter
        placeholder="Select Rights"
        class="w-full"
      />
    </div>
  </div>
  <div class="flex justify-end space-x-2">
    <Button @click="dialogRef?.close()" severity="secondary" label="Cancel" />
    <Button @click="save" label="Save" />
  </div>
</template>
<style>
.p-inputtext {
  width: 100%;
}
</style>
