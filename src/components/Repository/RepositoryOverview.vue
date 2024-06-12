<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
</script>
<template>
  <TabView>
    <TabPanel header="Images">
      <ImageView />
    </TabPanel>
    <TabPanel header="Datasets">
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
            <OverlayPanel ref="createCollectionPanel">
              <div class="flex space-x-1">
                <InputText v-model="newCollectioName" />
                <Button
                  icon="pi pi-check"
                  severity="info"
                  class="mr-2 w-fit"
                  @click="createCollection"
                />
              </div>
            </OverlayPanel>
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
    </TabPanel>
    <TabPanel header="Models" :disabled="true"></TabPanel>
    <TabPanel header="Workflows" :disabled="true"></TabPanel>
  </TabView>
</template>
