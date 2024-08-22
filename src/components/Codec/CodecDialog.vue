<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer
])


import VChart, { THEME_KEY } from 'vue-echarts';

provide(THEME_KEY, useDark().value ? 'dark' : 'light');


const dialogRef = inject("dialogRef");

const codec = ref()
const option = ref()

const mode = ref("Chart")
const options = ref(["Chart", "Table"])

onMounted(() => {
  codec.value = dialogRef.value.data.codec
  option.value = {
    toolbox: {
      show: true,
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: Object.keys(codec.value.codec),
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        allowDecimals: false,
        type: 'value'
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        yAxisIndex: 0
      },
      {
        type: 'slider',
        yAxisIndex: 0
      },
    ],
    series: [
      {
        name: 'Occurrence',
        type: 'bar',
        barWidth: '60%',
        data: Object.values(codec.value.codec)
      }
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5;
    }
  }
})
</script>
<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <SelectButton v-model="mode" :options="options" :allow-empty="false" />
    </div>
    <section v-if="mode === 'Chart'">
      <v-chart class="chart" :option="option" autoresize />
    </section>
    <section v-else>
      <DataTable></DataTable>
    </section>
  </div>
<!--  {{ codec.codec }}-->
</template>
<style scoped>
.chart {
  height: 70vh;
}
</style>
