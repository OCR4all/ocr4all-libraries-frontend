<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
import InputText from "primevue/inputtext";
import {FilterMatchMode} from "@primevue/core/api";
import DataTable from "primevue/datatable";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const collection = ref();
const sets = ref()

onMounted(() => {
  collection.value = dialogRef?.value.data.collection;
  sets.value = dialogRef?.value.data.sets;

  evaluate()
});

const dt = ref()

const data = ref()
const error = ref()
const isFetching = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  prediction: { value: null, matchMode: FilterMatchMode.EQUALS },
  "ground-truth": { value: null, matchMode: FilterMatchMode.EQUALS },
});

function evaluate(){
  const payload = {
    id: "de.uniwuerzburg.zpd.ocr4all.application.calamari.spi.evaluation.CalamariEvaluation",
    integers: [
      {
        "argument": "--n_confusions",
        "value": -1
      }
    ],
    dataset: {
      collections: [
        {
          id: collection.value,
          sets: sets.value
        }
      ]
    }
  }

  isFetching.value = true

  useCustomFetch(`/spi/action/evaluate/calamari`)
      .post(payload)
      .json()
      .then((response) => {
        error.value = response.error.value
        data.value = response.data.value
        isFetching.value = false
      })
}

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
<template>
  <div v-if="isFetching">
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-4">
        <Skeleton width="100%" height="8rem"></Skeleton>
        <Skeleton width="100%" height="8rem"></Skeleton>
        <Skeleton width="100%" height="8rem"></Skeleton>
        <Skeleton width="100%" height="8rem"></Skeleton>
      </div>
      <Skeleton width="100%" height="50vh"></Skeleton>
    </div>
  </div>
  <div v-else-if="data" class="space-y-12">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-4">
      <StatsCard>
        <template #title>
          Errors
        </template>
        <template #value>
          {{ Intl.NumberFormat('en-us', { maximumSignificantDigits: 3 }).format(
          data.summary.errs,
        ) }}
        </template>
      </StatsCard>
      <StatsCard>
        <template #title>
          Error Rate
        </template>
        <template #value>
          {{ data.summary["error-rate"].toFixed(2) }}%
        </template>
      </StatsCard>
      <StatsCard>
        <template #title>
          Total Characters
        </template>
        <template #value>
          {{ Intl.NumberFormat('en-us', { maximumSignificantDigits: 3 }).format(
          data.summary["total-characters"],
        ) }}
        </template>
      </StatsCard>
      <StatsCard>
        <template #title>
          Sync Errors
        </template>
        <template #value>
          {{ Intl.NumberFormat('en-us', { maximumSignificantDigits: 3 }).format(
          data.summary["sync-errs"]
        ) }}
        </template>
      </StatsCard>
    </div>
    <DataTable ref="dt" :value="data.details" v-model:filters="filters" scrollable scroll-height="50vh">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
          <Button icon="pi pi-download" text @click="exportCSV" />
        </div>
      </template>
      <Column field="count" header="Count" sortable>
        <template #body="{ data }">
          <p class="text-2xl">{{ data.count }}</p>
        </template>
      </Column>
      <Column field="prediction" header="Prediction">
        <template #body="{ data }">
          <p class="font-junicode text-2xl">{{ data.prediction }}</p>
        </template>
      </Column>
      <Column field="ground-truth" header="Ground Truth">
        <template #body="{ data }">
          <p class="font-junicode text-2xl">{{ data["ground-truth"] }}</p>
        </template>
      </Column>
      <Column field="cer" header="CER" sortable>
        <template #body="{ data }">
          <p class="text-2xl">{{ data.cer.toFixed(2) }}</p>
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else-if="error">
    <p class="text-2xl font-bold text-center py-20 ">No evaluation result could be generated.</p>
  </div>
</template>
