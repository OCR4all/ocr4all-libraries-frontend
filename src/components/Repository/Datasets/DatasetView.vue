<script setup lang="ts"></script>
<template>
  <Toolbar class="mb-4">
    <template #start>
      <div class="my-2 flex space-x-2">
        <ActionButton
          rounded
          type="primary"
          size="large"
          @click="toggleCreateCollectionPanel"
        >
          {{ $t("pages.repository.overview.toolbar.button.create") }}
        </ActionButton>
        <Popover ref="createCollectionPanel">
          <div class="flex space-x-1">
            <InputText v-model="newCollectioName" />
            <Button
              icon="pi pi-check"
              severity="info"
              class="mr-2 w-fit"
              @click="createCollection"
            />
          </div>
        </Popover>
        <ActionButton
          rounded
          type="delete"
          size="large"
          :disabled="!selectedCollections || !selectedCollections.length"
          @click="toggleDeleteDialog"
        >
          {{ $t("pages.repository.overview.toolbar.button.delete") }}
        </ActionButton>
      </div>
    </template>
    <template #end>
      <SelectButton v-model="layout" :options="options" :allowEmpty="false">
        <template #option="{ option }">
          <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-th-large']" />
        </template>
      </SelectButton>
    </template>
  </Toolbar>
</template>
