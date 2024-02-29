<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import BreadcrumbNavigation from "@/components/Layout/BreadcrumbNavigation.vue";
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dialog from "primevue/dialog";

const userDialog: Ref<boolean> = ref(false);
const deleteUserDialog: Ref<boolean> = ref(false);
const deleteUsersDialog: Ref<boolean> = ref(false);

const users = ref();
const user = ref({});
const selectedUsers = ref();

useCustomFetch(
  `/job/overview/administration`,
)
  .get()
  .json()
  .then((response) => console.log(response.data.value));

async function refetch() {
  useCustomFetch(`/administration/security/user/list`)
    .json()
    .then((response) => {
      users.value = response.data.value;
    });
}
function openNew() {}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function editUser(data) {
  user.value = data;
  userDialog.value = true;
}

function confirmDeleteUser(data) {
  user.value = data;
  console.log(user.value);
  deleteUserDialog.value = true;
}

function confirmDeleteSelected() {
  if (selectedUsers.value.length === 1) {
    user.value = selectedUsers.value[0];
    deleteUserDialog.value = true;
  } else if (selectedUsers.value.length > 1) {
    deleteUsersDialog.value = true;
  }
}

function hideUserDialog() {
  user.value = {};
  userDialog.value = false;
}

function hideDeleteDialog() {
  deleteUserDialog.value = false;
  deleteUsersDialog.value = false;
  user.value = false;
}

async function deleteUser(data = user.value) {
  useCustomFetch(`/administration/security/user/remove?login=${data.login}`)
    .json()
    .then((response) => {
      hideDeleteDialog();
      refetch();
    });
}

async function deleteUsers() {
  for (const user of selectedUsers.value) {
    await deleteUser(user);
  }
  hideDeleteDialog();
  refetch();
}

async function updateUser() {
  const payload = {
    login: user.value.login,
    state: user.value.state,
    email: user.value.email,
    name: user.value.name,
    password: user.value.password,
  };
  useCustomFetch(`/administration/security/user/update`)
    .post(payload)
    .then((response) => {
      hideUserDialog();
      refetch();
    });
}

async function createuser() {
  const payload = {
    login: user.value.login,
    state: user.value.state,
    email: user.value.email,
    name: user.value.name,
    password: user.value.password,
  };
  useCustomFetch(`/administration/security/user/create`)
    .post(payload)
    .then((response) => {
      hideUserDialog();
      refetch();
    });
}

const newUserDialog = ref(false);
function openNewUserDialog() {
  newUserDialog.value = true;
}

function hideNewUserDialog() {
  newUserDialog.value = false;
  user.value = {};
}

refetch();

const breadcrumbHome = { to: "/admin", label: "Admin Dashboard" };
const breadcrumbCurrent = { to: "/admin", label: "User Management" };
</script>
<template>
  <BreadcrumbNavigation :home="breadcrumbHome" :current="breadcrumbCurrent" />
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="openNewUserDialog"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedUsers || !selectedUsers.length"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="users"
        v-model:selection="selectedUsers"
        dataKey="login"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div
            class="align-items-center justify-content-between flex flex-wrap gap-2"
          >
            <h4 class="m-0">Manage Users</h4>
            <InputText
              v-model="filters['global'].value"
              placeholder="Search..."
            />
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column
          field="login"
          header="Login"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="email"
          header="Email"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="state"
          header="State"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editUser(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteUser(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      header="User Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="user.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-error" v-if="submitted && !user.name"
          >Name is required.</small
        >
      </div>
      <div class="field">
        <label for="login">Login</label>
        <InputText
          id="login"
          v-model="user.login"
          autofocus
          :class="{ 'p-invalid': submitted && !user.login }"
        />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="user.email"
          autofocus
          :class="{ 'p-invalid': submitted && !user.email }"
        />
      </div>
      <div class="field">
        <label for="state">State</label>
        <InputText
          id="state"
          v-model="user.state"
          autofocus
          :class="{ 'p-invalid': submitted && !user.state }"
        />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <Password v-model="user.password" :feedback="false" toggleMask />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          text
          @click="hideUserDialog"
        />
        <Button label="Save" icon="pi pi-check" text @click="updateUser" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="newUserDialog"
      :style="{ width: '450px' }"
      header="Create New User"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="user.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-error" v-if="submitted && !user.name"
          >Name is required.</small
        >
      </div>
      <div class="field">
        <label for="login">Login</label>
        <InputText
          id="login"
          v-model="user.login"
          autofocus
          :class="{ 'p-invalid': submitted && !user.login }"
        />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="user.email"
          autofocus
          :class="{ 'p-invalid': submitted && !user.email }"
        />
      </div>
      <div class="field">
        <label for="state">State</label>
        <InputText
          id="state"
          v-model="user.state"
          autofocus
          :class="{ 'p-invalid': submitted && !user.state }"
        />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <Password v-model="user.password" :feedback="false" toggleMask />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          text
          @click="hideNewUserDialog"
        />
        <Button label="Save" icon="pi pi-check" text @click="createuser" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteUserDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user"
          >Are you sure you want to delete <b>{{ user.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteUserDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" text @click="deleteUser" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteUsersDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user"
          >Are you sure you want to delete the following users?</span
        >
        <ul>
          <li v-for="user in selectedUsers" :key="user.key">
            {{ user.login }}
          </li>
        </ul>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteUsersDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" text @click="deleteUsers" />
      </template>
    </Dialog>
  </div>
</template>
