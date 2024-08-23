<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";
import { useCustomFetch } from "@/composables/useCustomFetch";

const datasets = ref();
const parameters = ref();

const PROCESSOR =
  "de.uniwuerzburg.zpd.ocr4all.application.calamari.spi.training.CalamariTraining";

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Training",
    to: "/training/overview",
  },
  {
    label: "Calamari",
  },
];

function run() {
  const data = datasets.value.getDatasets()
  console.log(datasets.value.getDatasets())

  // const dataset = {
  //   "collections": [
  //     {
  //       "sets": [
  //         {
  //          id: "a0457f0e-252a-44bd-b47d-2c368348375d",
  //          xml: "xml",
  //          image: "bin.png"
  //         },
  //         {
  //           id: "a562aed9-6001-4307-a412-d24174881b1f",
  //           xml: "xml",
  //           image: "bin.png"
  //         },
  //         {
  //           id: "c2ae1750-d1d0-45ea-a508-7ffa9593a5b0",
  //           xml: "xml",
  //           image: "bin.png"
  //         }
  //       ],
  //       "id": "57083b81-9c10-4b68-b021-5b4f4fcba97c"
  //     }
  //   ]
  // }
  // const params = parameters.value.getParameters()
  //
  // const payload = {
  //   dataset: dataset,
  //   id: PROCESSOR,
  //   "job-short-description": "Start calamari training",
  //   ...(params.booleans.length !== 0 && { booleans: params.booleans }),
  //   ...(params.decimals.length !== 0 && { decimals: params.decimals }),
  //   ...(params.integers.length !== 0 && { integers: params.integers }),
  //   ...(params.selects.length !== 0 && { selects: params.selects }),
  //   ...(params.strings.length !== 0 && { strings: params.strings }),
  //   "assemble-model": {
  //     "name": "test-training",
  //     "description": "start test training",
  //     "keywords": [
  //       "string"
  //     ]
  //   },
  // };
  //
  // console.log(payload)
  //
  // useCustomFetch("/spi/training/schedule")
  //   .post(payload)
  //   .then((response) => {
  //     console.log(response.error.value)
  //   });
}
</script>
<template>
  <Button label="Run" @click="run" />
  <ComponentContainer>
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
          <div class="flex gap-2 py-6">
            <Button
              label="Back"
              severity="secondary"
              @click="activateCallback('1')"
            />
            <Button label="Next" @click="activateCallback('3')" />
          </div>
        </StepPanel>
      </StepItem>
      <StepItem value="3">
        <Step>Run</Step>
        <StepPanel v-slot="{ activateCallback }">
          <Button label="Launch" @click="run" />
          <div class="py-6">
            <Button
              label="Back"
              severity="secondary"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>
  </ComponentContainer>
</template>
