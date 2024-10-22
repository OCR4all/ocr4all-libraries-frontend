<script setup lang="ts">
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import darkTheme from "@/assets/echarts/dark.project.json";
import lightTheme from "@/assets/echarts/light.project.json";

import IconCsv from "~icons/ph/file-csv";

use([
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer,
]);

import VChart, { THEME_KEY } from "vue-echarts";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "@primevue/core/api";

provide(THEME_KEY, useDark().value ? darkTheme : lightTheme);

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const dt = ref();

const codec = ref();
const option = ref();

const mode = ref("Table");
const options = ref(["Chart", "Table"]);

onMounted(() => {
  codec.value = dialogRef?.value.data.codec;
  option.value = {
    toolbox: {
      show: true,
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: Object.keys(codec.value.codec),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        allowDecimals: false,
        type: "value",
      },
    ],
    dataZoom: [
      {
        type: "inside",
        yAxisIndex: 0,
      },
      {
        type: "slider",
        yAxisIndex: 0,
      },
    ],
    series: [
      {
        name: "Occurrence",
        type: "bar",
        barWidth: "60%",
        data: Object.values(codec.value.codec),
      },
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: function (idx) {
      return idx * 5;
    },
  };
});

/** TODO: Implement per page codec display, needs additional input from backend **/
const selectedSet = ref();
const sets = ref([]);

const datatableNodes = computed(() => {
  const nodes = [];
  if (codec.value) {
    for (const [key, value] of Object.entries(codec.value.codec)) {
      nodes.push({
        id: key,
        quantity: value,
      });
    }
  }
  return nodes;
});

const exportCSV = () => {
  dt.value.exportCSV();
};

const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>
<template>
  <ComponentContainer spaced internal>
    <Toolbar>
      <template #start>
        <!--        <Select
          v-model="selectedSet"
          :options="sets"
          sets="name"
          placeholder="Select a Set"
          class="w-full md:w-56"
        />-->
        <Button
          v-tooltip.top="'Export CSV'"
          severity="primary"
          text
          @click="exportCSV($event)"
        >
          <IconCsv class="text-black dark:text-white" />
        </Button>
      </template>
      <template #center>
        <SelectButton v-model="mode" :options="options" :allow-empty="false" />
      </template>
      <template #end>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters['id'].value" placeholder="Search" />
        </IconField>
      </template>
    </Toolbar>
    <div class="flex flex-col">
      <section v-if="mode === 'Chart'">
        <v-chart class="chart" :option="option" autoresize />
      </section>
      <section v-else>
        <DataTable
          ref="dt"
          :value="datatableNodes"
          v-model:filters="filters"
          resizable-columns
          column-resize-mode="expand"
          sort-field="quantity"
          :sort-order="-1"
        >
          <Column field="id" header="Character" sortable></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
        </DataTable>
      </section>
    </div>
  </ComponentContainer>
</template>
<style scoped>
.chart {
  height: 70vh;
}
</style>
