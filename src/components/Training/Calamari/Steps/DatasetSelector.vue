<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import TreeTable from "primevue/treetable";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import { useCustomFetch } from "@/composables/useCustomFetch";
import Image from "primevue/image";
import Chip from "primevue/chip";
import Skeleton from "primevue/skeleton";

onMounted(() => {
  loading.value = true;

  useCustomFetch("/data/collection/list")
    .json()
    .then((response) => {
      console.log(response.data.value)
      for (const entry of response.data.value) {
        nodes.value.push({
          key: entry.id,
          data: {
            name: entry.name,
            type: "container",
            thumbnail: null,
            keywords: entry.keywords,
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
  const isChecked = !!(
    selectedSets.value && Object.keys(selectedSets.value).includes(node.key)
  );
  if (!node.children) {
    loading.value = true;
    useCustomFetch(`/data/collection/set/list/${node.key}`)
      .json()
      .then(async (response) => {
        console.log(response.data.value)
        const children = [];
        for (const set of response.data.value) {
          const key = set.id;
          children.push({
            key: key,
            data: {
              name: set.name,
              type: "set",
              keywords: set.keywords,
            },
          });
          if (isChecked) {
            selectedSets.value[`${key}`] = {
              checked: true,
              partialChecked: false,
            };
          }
        }
        node.children = children;
        loading.value = false;
      });
  }
};

const selectedSets = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

async function getDatasets() {
  const registry = {};
  const selection = [];
  console.log(nodes.value)
  console.log(selectedSets.value)
  for (const [key, value] of Object.entries(selectedSets.value)) {
    if (value.checked === true) {
      const { data, error } = await useCustomFetch(
        `/data/collection/set/list/${key}`,
      ).json();
    }
  }
  for (const sets of nodes.value) {
    if (selection.includes(sets.key)) {
      registry[sets.key] = true;
    } else {
      if (sets.children) {
        const selectedFolios = [];
        for (const folio of sets.children) {
          if (selection.includes(folio.key)) selectedFolios.push(folio.key);
        }
        if (selectedFolios.length) {
          registry[sets.key] = selectedFolios;
        }
      }
    }
  }

  return selection;
}

defineExpose({
  getDatasets,
});
</script>
<template>
  <div class="card justify-content-center grid space-y-2 pb-8">
    <TreeTable
      :value="nodes"
      :lazy="true"
      :paginator="true"
      :rows="rows"
      :loading="loading"
      v-model:filters="filters"
      filter-display="row"
      :globalFilterFields="['name']"
      :total-records="totalRecords"
      v-model:selectionKeys="selectedSets"
      selectionMode="checkbox"
      scrollable
      scrollHeight="70vh"
      @node-expand="onExpand"
    >
      <template #header>
        <InputText
          v-model="filters['global'].value"
          :placeholder="$t('pages.projects.overview.table.search.placeholder')"
        />
      </template>
      <Column field="name" header="Name" expander></Column>
      <Column field="thumbnail" header="Image">
        <template #body="slotProps">
          <Suspense>
            <Image v-if="slotProps.node.data.thumbnail" alt="Image" preview>
              <template #indicatoricon>
                <i class="pi pi-search"></i>
              </template>
              <template #image>
                <img
                  :src="slotProps.node.data.thumbnail"
                  class="max-w-24 max-h-24 object-scale-down"
                  alt="image"
                />
              </template>
              <template #preview="props">
                <img
                  :src="slotProps.node.data.detail"
                  alt="preview"
                  :style="props.style"
                  @click="props.onClick"
                />
              </template>
            </Image>
          </Suspense>
        </template>
      </Column>
      <Column
        :header="$t('pages.repository.overview.dataview.list.column.keywords')"
      >
        <template #loading>
          <div
            class="align-items-center flex"
            :style="{
              height: '17px',
              'flex-grow': '1',
              overflow: 'hidden',
            }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
        <template #body="slotProps">
          <Chip
            v-for="keyword of slotProps.node.data.keywords"
            :key="keyword"
            >{{ keyword }}</Chip
          >
        </template>
      </Column>
    </TreeTable>
  </div>
</template>
