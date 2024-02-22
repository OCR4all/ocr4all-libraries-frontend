<script setup lang="ts">
import { FilterMatchMode } from "primevue/api";
import TreeTable from "primevue/treetable";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import { useCustomFetch } from "@/composables/useCustomFetch";

const emits = defineEmits(["import-folios"]);

function importFolios() {
  console.log(selectedFolios);
}

onMounted(() => {
  loading.value = true;

  useCustomFetch("/repository/container/list")
    .json()
    .then((response) => {
      for (const entry of response.data.value) {
        nodes.value.push({
          key: entry.id,
          data: {
            name: entry.name,
            type: "container",
          },
          leaf: false,
        });
      }
      loading.value = false;
    });
});

const nodes = ref([]);
const rows = ref(10);
const loading = ref(false);
const totalRecords = ref(0);
const onExpand = (node) => {
  if (!node.children) {
    loading.value = true;
    useCustomFetch(`/repository/container/folio/list/${node.key}`)
      .json()
      .then((response) => {
        const children = [];
        for (const folio of response.data.value) {
          const thumbnail = ref();
          useCustomFetch(
            `/repository/container/folio/derivative/thumbnail/${node.key}?id=${folio.id}`,
          )
            .get()
            .blob()
            .then((response) => {
              thumbnail.value = useObjectUrl(response.data.value);
            });

          children.push({
            key: folio.id,
            data: {
              name: folio.name,
              type: "folio",
            },
          });
        }
        node.children = children;
        loading.value = false;
      });
  }
};

const selectedFolios = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  state: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>
<template>
  <div class="card justify-content-center grid space-y-2">
    <TreeTable
      :value="nodes"
      :lazy="true"
      :paginator="true"
      :rows="rows"
      :loading="loading"
      :filters="filters"
      :globalFilterFields="['name']"
      :total-records="totalRecords"
      v-model:selectionKeys="selectedFolios"
      selectionMode="checkbox"
      scrollable
      scrollHeight="80rem"
      @node-expand="onExpand"
    >
      <template #header>
        <InputText
          v-model="filters['global'].value"
          :placeholder="$t('pages.projects.overview.table.search.placeholder')"
        />
      </template>
      <Column field="name" header="Name" expander></Column>
      <Column field="img" header="Image"> </Column>
    </TreeTable>
    <button
      @click="importFolios"
      class="w-64 justify-self-center bg-primary-500 p-2 font-semibold text-surface-50 hover:bg-primary-600 disabled:bg-primary-200"
      :disabled="!selectedFolios"
    >
      Import
    </button>
  </div>
</template>
