<script setup lang="ts">

const datasets = ref()
const parameters = ref()

function run(){
  datasets.value.getDatasets()
  console.log(parameters.value.getParameters())
}
</script>
<template>
  <Stepper value="1">
    <StepItem value="1">
      <Step>Dataset</Step>
      <StepPanel v-slot="{ activateCallback }">
        <DatasetSelector ref="datasets" />
        <div class="py-6">
          <Button label="Next" @click="activateCallback('2')" />
        </div>
      </StepPanel>
    </StepItem>
    <StepItem value="2">
      <Step>Parameters</Step>
      <StepPanel v-slot="{ activateCallback }">
        <ParameterSelector ref="parameters" />
        <div class="flex py-6 gap-2">
          <Button label="Back" severity="secondary" @click="activateCallback('1')" />
          <Button label="Next" @click="activateCallback('3')" />
        </div>
      </StepPanel>
    </StepItem>
    <StepItem value="3">
      <Step>Run</Step>
      <StepPanel v-slot="{ activateCallback }">
        <Button label="Launch" @click="run" />
        <div class="py-6">
          <Button label="Back" severity="secondary" @click="activateCallback('2')" />
        </div>
      </StepPanel>
    </StepItem>
  </Stepper>
</template>