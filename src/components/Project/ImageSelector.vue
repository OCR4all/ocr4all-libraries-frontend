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

interface IData {
  name: string,
  type: string,
  thumbnail: null | Ref<string | undefined>,
  detail: null | Ref<string | undefined>,
  keywords: null | string[]
}

interface INode {
  key: string,
  data: IData,
  leaf: boolean
  children: undefined | INode[]
}

function get() {
  const registry = {};
  const selection = [];
  for (const [key, value] of Object.entries(selectedFolios.value)) {
    if (value.checked === true) selection.push(key);
  }
  for (const container of nodes.value) {
    if (selection.includes(container.key)) {
      registry[container.key] = true;
    } else {
      if (container.children) {
        const selectedFolios = [];
        for (const folio of container.children) {
          if (selection.includes(folio.key)) selectedFolios.push(folio.key);
        }
        if (selectedFolios.length) {
          registry[container.key] = selectedFolios;
        }
      }
    }
  }
  return registry
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
            thumbnail: null,
            keywords: entry.keywords,
          },
          leaf: false,
        });
      }
      loading.value = false;
    });
});

const nodes: Ref<INode[]> = ref([]);
const rows = ref(10);
const loading = ref(false);
const totalRecords = ref(0);
const onExpand = (node) => {
  const isChecked = (
    selectedFolios.value && Object.keys(selectedFolios.value).includes(node.key)
  );
  if (!node.children) {
    loading.value = true;
    useCustomFetch(`/repository/container/folio/list/${node.key}`)
      .json()
      .then(async (response) => {
        const children = [];
        for (const folio of response.data.value) {
          const key = folio.id;
          children.push({
            key: key,
            data: {
              name: folio.name,
              type: "folio",
              thumbnail: useCustomFetch(
                `/repository/container/folio/derivative/best/${node.key}?id=${key}`,
              )
                .get()
                .blob()
                .then((response) => {
                  const parent = nodes.value.find((elem) => elem.key === node.key)
                  if(parent && parent.children) {
                    const child = parent.children.find((child) => child.key === key)
                    if(child){
                      child.data.thumbnail = useObjectUrl(response.data)
                    }
                  }
                }),
              detail: useCustomFetch(
                `/repository/container/folio/derivative/best/${node.key}?id=${key}`,
              )
                .get()
                .blob()
                .then((response) => {
                  const parent = nodes.value.find((elem) => elem.key === node.key)
                  if(parent && parent.children) {
                    const child = parent.children.find((child) => child.key === key)
                    if(child){
                      child.data.detail = useObjectUrl(response.data)
                    }
                  }
                }),
              keywords: folio.keywords,
            },
          });
          if (isChecked) {
            selectedFolios.value[`${key}`] = {
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

const selectedFolios = ref({});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

defineExpose({
  selectedFolios,
  get
})
</script>
<template>
  <ComponentContainer spaced internal>
    <Toolbar>
      <template #end>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Search" />
        </IconField>
      </template>
    </Toolbar>
    <TreeTable
      :value="nodes"
      :lazy="true"
      :paginator="true"
      :rows="rows"
      :loading="loading"
      :filters="filters"
      filter-display="row"
      :globalFilterFields="['name']"
      :total-records="totalRecords"
      v-model:selectionKeys="selectedFolios"
      selectionMode="checkbox"
      scrollable
      @node-expand="onExpand"
    >
      <Column field="name" header="Name" expander></Column>
      <Column field="thumbnail" header="Image">
        <template #body="slotProps">
          <div v-show="slotProps.node.data.type === 'folio'">
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
            <Skeleton v-else size="4rem" />
          </div>
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
  </ComponentContainer>
</template>
