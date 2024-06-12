<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dialog from "primevue/dialog";
import Tag from 'primevue/tag';
import { useUiStore } from "@/stores/ui.store";

const userDialog: Ref<boolean> = ref(false);
const deleteUserDialog: Ref<boolean> = ref(false);
const deleteUsersDialog: Ref<boolean> = ref(false);

const users = ref();
const user = ref({});
const selectedUsers = ref();

async function refetch() {
  useCustomFetch(`/administration/security/user/list`)
    .json()
    .then((response) => {
      users.value = response.data.value;
      getUserGroups()
    });
}

useCustomFetch(`/instance/environment`).json().then((response) => {console.log(response.data.value)})

async function getUserGroups() {
  for(const user of users.value){
    useCustomFetch(`/administration/security/user/entity?login=${user.login}`)
      .json()
      .then((response) => {
        console.log(user.login)
        console.log(response.data.value.login)
        user["groups"] = response.data.value.groups
      });
  }
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function editUser(data) {
  user.value = data;
  userDialog.value = true;
}

function confirmDeleteUser(data) {
  user.value = data;
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

async function createUser() {
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
      hideNewUserDialog();
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

const uiStore = useUiStore()
uiStore.breadcrumb = [
  {
    label: "Administration",
  },
]
</script>
<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <div class="my-2 space-x-2">
            <ActionButton
              rounded
              type="primary"
              size="large"
              @click="openNewUserDialog"
            >
              {{ $t("admin.user-management.table.toolbar.add-user") }}
            </ActionButton>
            <ActionButton
              rounded
              type="delete"
              size="large"
              @click="confirmDeleteSelected"
              :disabled="!selectedUsers || !selectedUsers.length"
            >
              {{ $t("admin.user-management.table.toolbar.delete-user") }}
            </ActionButton>
          </div>
        </template>
      </Toolbar>
      <div class="rounded-md border border-surface-200 dark:border-surface-700">
        <DataTable
          ref="dt"
          scrollable
          :value="users"
          v-model:selection="selectedUsers"
          dataKey="login"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
        >
          <template #header>
            <div class="align-items-center flex flex-wrap justify-between gap-2">
              <h4 class="m-0">
                {{ $t("admin.user-management.table.header") }}
              </h4>
              <InputText
                v-model="filters['global'].value"
                :placeholder="
                $t('admin.user-management.table.search-placeholder')
              "
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
            :header="$t('admin.user-management.table.columns.name')"
            sortable
            style="min-width: 16rem"
          ></Column>
          <Column
            field="login"
            :header="$t('admin.user-management.table.columns.login')"
            sortable
            style="min-width: 12rem"
          ></Column>
          <Column
            field="email"
            :header="$t('admin.user-management.table.columns.mail')"
            sortable
            style="min-width: 12rem"
          ></Column>
          <Column
            field="groups"
            :header="$t('admin.user-management.table.columns.groups')"
            sortable
            style="min-width: 12rem"
          >
            <template #body="slotProps">
              <Tag v-for="group in slotProps.data.groups" :key="group.label" :value="group.name" severity="info" />
            </template>
          </Column>
          <Column
            field="state"
            :header="$t('admin.user-management.table.columns.state')"
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
    </div>

    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      :header="$t('admin.user-management.dialog.edit.header')"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid grid-cols-2 gap-2">
        <div class="field">
          <label for="name">{{
            $t("admin.user-management.dialog.edit.body.form.name")
          }}</label>
          <InputText
            id="name"
            v-model.trim="user.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.name }"
          />
          <small v-if="submitted && !user.name" class="p-error"
            >Name is required.</small
          >
        </div>
        <div class="field">
          <label for="login">{{
            $t("admin.user-management.dialog.edit.body.form.login")
          }}</label>
          <InputText
            id="login"
            v-model="user.login"
            autofocus
            :class="{ 'p-invalid': submitted && !user.login }"
          />
        </div>
        <div class="field">
          <label for="email">{{
            $t("admin.user-management.dialog.edit.body.form.mail")
          }}</label>
          <InputText
            id="email"
            v-model="user.email"
            autofocus
            :class="{ 'p-invalid': submitted && !user.email }"
          />
        </div>
        <div class="field">
          <label for="state">{{
            $t("admin.user-management.dialog.edit.body.form.state")
          }}</label>
          <InputText
            id="state"
            v-model="user.state"
            autofocus
            :class="{ 'p-invalid': submitted && !user.state }"
          />
        </div>
        <div class="field">
          <label for="password">{{
            $t("admin.user-management.dialog.edit.body.form.password")
          }}</label>
          <Password v-model="user.password" :feedback="false" toggleMask />
        </div>
      </div>

      <template #footer>
        <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="newUserDialog"
      :style="{ width: '450px' }"
      :header="$t('admin.user-management.dialog.create.header')"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid grid-cols-2 gap-2">
        <div class="field">
          <label for="name">{{
            $t("admin.user-management.dialog.create.body.form.name")
          }}</label>
          <InputText
            id="name"
            v-model.trim="user.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.name }"
          />
          <small v-if="submitted && !user.name" class="p-error"
            >Name is required.</small
          >
        </div>
        <div class="field">
          <label for="login">{{
            $t("admin.user-management.dialog.create.body.form.login")
          }}</label>
          <InputText
            id="login"
            v-model="user.login"
            autofocus
            :class="{ 'p-invalid': submitted && !user.login }"
          />
        </div>
        <div class="field">
          <label for="email">{{
            $t("admin.user-management.dialog.create.body.form.mail")
          }}</label>
          <InputText
            id="email"
            v-model="user.email"
            autofocus
            :class="{ 'p-invalid': submitted && !user.email }"
          />
        </div>
        <div class="field">
          <label for="state">{{
            $t("admin.user-management.dialog.create.body.form.state")
          }}</label>
          <InputText
            id="state"
            v-model="user.state"
            autofocus
            :class="{ 'p-invalid': submitted && !user.state }"
          />
        </div>
        <div class="field">
          <label for="password">{{
            $t("admin.user-management.dialog.create.body.form.password")
          }}</label>
          <Password v-model="user.password" :feedback="false" toggleMask />
        </div>
      </div>

      <template #footer>
        <ActionButton rounded size="large" @click="hideNewUserDialog">
          <i class="pi pi-times"></i>
          {{ $t("admin.user-management.dialog.create.footer.button.cancel") }}
        </ActionButton>
        <ActionButton rounded type="primary" size="large" @click="createUser">
          <i class="pi pi-check"></i>
          {{ $t("admin.user-management.dialog.create.footer.button.save") }}
        </ActionButton>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteUserDialog"
      :style="{ width: '450px' }"
      :header="$t('admin.user-management.dialog.delete.single.header')"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="user">
          {{
            $t("admin.user-management.dialog.delete.single.body.warning", {
              user: user.name,
            })
          }}
        </span>
      </div>
      <template #footer>
        <ActionButton rounded size="large" @click="deleteUserDialog = false">
          <i class="pi pi-times"></i>
          {{ $t("admin.user-management.dialog.delete.footer.button.cancel") }}
        </ActionButton>
        <ActionButton rounded type="delete" size="large" @click="deleteUser">
          <i class="pi pi-check"></i>
          {{ $t("admin.user-management.dialog.delete.footer.button.save") }}
        </ActionButton>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteUsersDialog"
      :style="{ width: '450px' }"
      :header="$t('admin.user-management.dialog.delete.multiple.header')"
      :modal="true"
    >
      <div class="confirmation-content">
        <span v-if="user">
          {{
            $t("admin.user-management.dialog.delete.single.body.warning", {
              user: user.name,
            })
          }}
        </span>
        <ul>
          <li v-for="selectedUser in selectedUsers" :key="selectedUser.key">
            {{ selectedUser.login }}
          </li>
        </ul>
      </div>
      <template #footer>
        <ActionButton rounded size="large" @click="deleteUsersDialog = false">
          <i class="pi pi-times"></i>
          {{ $t("admin.user-management.dialog.delete.footer.button.cancel") }}
        </ActionButton>
        <ActionButton rounded type="delete" size="large" @click="deleteUsers">
          <i class="pi pi-check"></i>
          {{ $t("admin.user-management.dialog.delete.footer.button.save") }}
        </ActionButton>
      </template>
    </Dialog>
  </div>
</template>
