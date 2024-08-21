<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { IJob } from "@/components/Queue/queue.interfaces";
import { useDialog } from "primevue/usedialog";

const dialogRef = inject("dialogRef");
const logViewer = defineAsyncComponent(
  () =>
    import(
      "@/components/Queue/Dialog/LogViewer.vue"
      ),
);

const job: Ref<IJob | undefined> = ref()

const expandedRows = ref()

const dialog = useDialog()

onMounted(async () => {
  await useCustomFetch(
    `/job/entity/${dialogRef.value.data.id}`,
  ).get().json().then((response) => {
    job.value = [response.data.value]
    console.log(job.value)
  });
});

function openLogDialog(text: string, type: string){
  dialog.open(logViewer, {
    props: {
      header: type,
      modal: true,
    },
    data: {
      text: text
    },
  });
}

function getSeverity(severity: string): string {
  switch(severity){
    case "completed":
      return "success"
    case "interrupted":
      return "warn"
  }
}
</script>
<template>
  <DataTable v-model:expandedRows="expandedRows" :value="job">
    <Column expander style="width: 5rem" />
    <Column field="id" header="Id"></Column>
    <Column field="description" header="Description"></Column>
    <Column field="created" header="Created"></Column>
    <Column field="start" header="Started"></Column>
    <Column field="end" header="End"></Column>
    <Column field="state" header="State">
      <template #body="{ data }">
        <Tag :value="data.state" :severity="getSeverity(data.state)" />
      </template>
    </Column>
    <template #expansion="slotProps">
      <div class="p-4">
        <h5>Journal</h5>
        <DataTable :value="slotProps.data.journal.steps">
          <Column field="index" header="Index"></Column>
          <Column field="completed" header="Completed">
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
              'pi-check-circle text-green-500':
                data.completed === true,
              'pi-times-circle text-red-400':
                data.completed !== true,
            }"
              ></i>
            </template>
          </Column>
          <Column field="progress" header="Progress"></Column>
          <Column field="service-provider-id" header="Service Provider">
            <template #body="{ data }">
              <Tag v-if="data['service-provider-id']" :value="data['service-provider-id']" />
            </template>
          </Column>
          <Column field="note" header="Note">
            <template #body="{ data }">
              <Button v-if="data['note']" @click="openLogDialog(data['note'], 'Note')" severity="contrast">
                View
              </Button>
              <p v-else>
                Empty
              </p>
            </template>
          </Column>
          <Column field="standard-error" header="Error Log">
            <template #body="{ data }">
              <Button v-if="data['standard-error']" @click="openLogDialog(data['standard-error'], 'Error Log')" severity="contrast">
                View
              </Button>
              <p v-else>
                Empty
              </p>
            </template>
          </Column>
          <Column field="standard-output" header="Output Log">
            <template #body="{ data }">
              <Button v-if="data['standard-error']" @click="openLogDialog(data['standard-output'], 'Output Log')" severity="contrast">
                View
              </Button>
              <p v-else>
                Empty
              </p>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </DataTable>
</template>
