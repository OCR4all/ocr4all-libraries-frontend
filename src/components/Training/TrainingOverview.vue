<script setup lang="ts">
import KrakenIcon from '~icons/fa-brands/gitkraken'
import TesseractIcon from '~icons/icon-park-outline/cube-four'
import EynollahIcon from '~icons/game-icons/cyber-eye'
import IconCalamari from '~icons/custom-logos/calamari'

import {useUiStore} from "@/stores/ui.store";

const router = useRouter()

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Training",
  },
];

const category = ref("Automatic Text Recognition")
const options = ref([
    "Automatic Text Recognition",
    "Document Layout Analysis"
])

useHead({
  title: "Training",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <ComponentContainer>
    <div class="grid grid-cols-1 gap-y-12 m-12 lg/container:m-23 content-center">
      <div class="flex justify-center">
        <SelectButton v-model="category" :options="options" aria-labelledby="basic" >
          <template #option="slotProps">
            <p class="text-xl">{{ slotProps.option }}</p>
          </template>
        </SelectButton>
      </div>
      <section v-if="category === 'Automatic Text Recognition'" class="flex-col space-y-12">
        <Spotlight class="max-w-sm mx-auto grid gap-6 grid-cols-1 @2xl/content:grid-cols-3 items-start lg:max-w-none group">
          <SpotlightCard @click="router.push('/training/calamari')">
            <div class="relative cursor-pointer h-full bg-surface-0 dark:bg-surface-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
              <!-- Radial gradient -->
              <div class="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
                <div class="absolute inset-0 translate-z-0 bg-surface-800 rounded-full blur-[80px]"></div>
              </div>
              <div class="flex flex-col h-full items-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div class="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-primary-600" aria-hidden="true"></div>
                  <IconCalamari class="text-surface-800 dark:text-surface-200 w-[150px] h-[150px]" />
                </div>
                <!-- Text -->
                <div class="grow mb-5">
                  <h2 class="text-2xl text-surface-800 dark:text-surface-200 font-bold mb-1">Calamari</h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">Line based ATR Engine based on OCRopy.</p>
                </div>
                <Button class="text-surface-700 dark:text-surface-300">Open</Button>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard>
            <div class="relative h-full bg-surface-0 dark:bg-surface-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
              <!-- Radial gradient -->
              <div class="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
                <div class="absolute inset-0 translate-z-0 bg-surface-800 rounded-full blur-[80px]"></div>
              </div>
              <div class="flex flex-col h-full items-center align-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div class="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-primary-600" aria-hidden="true"></div>
                  <KrakenIcon class="text-surface-800 dark:text-surface-200 w-[150px] h-[150px]" />
                </div>
                <!-- Text -->
                <div class="grow mb-5">
                  <h2 class="text-2xl text-surface-800 dark:text-surface-200 font-bold mb-1">Kraken</h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">OCR engine for all the languages.</p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">Coming Soon</p>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard>
            <div class="relative h-full bg-surface-0 dark:bg-surface-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
              <!-- Radial gradient -->
              <div class="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
                <div class="absolute inset-0 translate-z-0 bg-surface-800 rounded-full blur-[80px]"></div>
              </div>
              <div class="flex flex-col h-full items-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div class="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-primary-600" aria-hidden="true"></div>
                  <TesseractIcon class="text-surface-800 dark:text-surface-200 w-[150px] h-[150px]" />
                </div>
                <!-- Text -->
                <div class="grow mb-5">
                  <h2 class="text-xl text-surface-800 dark:text-surface-200 font-bold mb-1">Tesseract</h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">Fast and battle-tested OCR engine.</p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">Coming Soon</p>
              </div>
            </div>
          </SpotlightCard>
        </Spotlight>
      </section>
      <section v-else-if="category === 'Document Layout Analysis'" class="flex-col space-y-12">
        <Spotlight class="max-w-sm mx-auto grid gap-6 grid-cols-1 xl:grid-cols-2 items-start content-center lg:max-w-none group">
          <SpotlightCard>
            <div class="relative h-full bg-surface-0 dark:bg-surface-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
              <!-- Radial gradient -->
              <div class="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
                <div class="absolute inset-0 translate-z-0 bg-surface-800 rounded-full blur-[80px]"></div>
              </div>
              <div class="flex flex-col h-full items-center align-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div class="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-primary-600" aria-hidden="true"></div>
                  <KrakenIcon class="text-surface-800 dark:text-surface-200 w-[150px] h-[150px]" />
                </div>
                <!-- Text -->
                <div class="grow mb-5">
                  <h2 class="text-2xl text-surface-800 dark:text-surface-200 font-bold mb-1">Kraken</h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">Bottom-up Document Layout Analyis Engine.</p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">Coming Soon</p>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard>
            <div class="relative h-full bg-surface-0 dark:bg-surface-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
              <!-- Radial gradient -->
              <div class="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
                <div class="absolute inset-0 translate-z-0 bg-surface-800 rounded-full blur-[80px]"></div>
              </div>
              <div class="flex flex-col h-full items-center align-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div class="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-primary-600" aria-hidden="true"></div>
                  <EynollahIcon class="text-surface-800 dark:text-surface-200 w-[150px] h-[150px]" />
                </div>
                <!-- Text -->
                <div class="grow mb-5">
                  <h2 class="text-2xl text-surface-800 dark:text-surface-200 font-bold mb-1">Eynollah</h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">Document Layout Analysis with Deep Learning and Heuristics.</p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">Coming Soon</p>
              </div>
            </div>
          </SpotlightCard>
        </Spotlight>
      </section>
    </div>
  </ComponentContainer>
</template>