<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { IJob } from "@/components/Queue/queue.interfaces";

const dialogRef = inject("dialogRef");

const job: Ref<IJob | undefined> = ref()

const expandedRows = ref()

onMounted(async () => {
  await useCustomFetch(
    `/job/entity/${dialogRef.value.data.id}`,
  ).get().json().then((response) => {
    job.value = response.data.value
    console.log(job.value)
  });
});
</script>
<template>
  <Suspense>
    <DataTable v-model:expandedRows="expandedRows" :value="job" dataKey="id" tableStyle="min-width: 60rem">
      <Column expander style="width: 5rem" />
      <Column field="id" header="Id"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="shadow-lg" width="64" />
        </template>
      </Column>
      <Column field="price" header="Price">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="category" header="Category"></Column>
      <Column field="rating" header="Reviews">
        <template #body="slotProps">
          <Rating :modelValue="slotProps.data.rating" readonly />
        </template>
      </Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <h5>Orders for {{ slotProps.data.name }}</h5>
          <DataTable :value="slotProps.data.orders">
            <Column field="id" header="Id" sortable></Column>
            <Column field="customer" header="Customer" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="amount" header="Amount" sortable>
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
              </template>
            </Column>
            <Column field="status" header="Status" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.status.toLowerCase()" :severity="getOrderSeverity(slotProps.data)" />
              </template>
            </Column>
            <Column headerStyle="width:4rem">
              <template #body>
                <Button icon="pi pi-search" />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <template #fallback>
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                       animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </template>
  </Suspense>
</template>
