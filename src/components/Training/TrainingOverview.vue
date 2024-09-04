<script setup lang="ts">
import KrakenIcon from "~icons/fa-brands/gitkraken";
import TesseractIcon from "~icons/icon-park-outline/cube-four";
import EynollahIcon from "~icons/game-icons/cyber-eye";
import IconCalamari from "~icons/custom-logos/calamari";

import { useUiStore } from "@/stores/ui.store";

const router = useRouter();

const uiStore = useUiStore();
uiStore.breadcrumb = [
  {
    label: "Training",
  },
];

const category = ref("Automatic Text Recognition");
const options = ref(["Automatic Text Recognition", "Document Layout Analysis"]);

useHead({
  title: "Training",
  titleTemplate: "%s %separator %siteName",
  templateParams: { separator: "|", siteName: "OCR4all" },
  bodyAttrs: { class: { overflow: true } },
});
</script>

<template>
  <ComponentContainer>
    <div
      class="lg/container:m-23 m-12 grid grid-cols-1 content-center gap-y-12"
    >
      <div class="flex justify-center">
        <SelectButton
          v-model="category"
          :options="options"
          aria-labelledby="basic"
          :allowEmpty="false"
        >
          <template #option="slotProps">
            <p class="text-xl">{{ slotProps.option }}</p>
          </template>
        </SelectButton>
      </div>
      <section
        v-if="category === 'Automatic Text Recognition'"
        class="flex-col space-y-12"
      >
        <Spotlight
          class="group mx-auto grid grid-cols-1 items-start gap-6 @5xl/content:grid-cols-3 lg:max-w-none"
        >
          <SpotlightCard @click="router.push('/training/calamari')">
            <div
              class="relative z-20 h-full cursor-pointer overflow-hidden rounded-[inherit] bg-surface-0 p-6 pb-8 dark:bg-surface-900"
            >
              <!-- Radial gradient -->
              <div
                class="aspect-square pointer-events-none absolute bottom-0 left-1/2 -z-10 w-1/2 -translate-x-1/2 translate-y-1/2"
                aria-hidden="true"
              >
                <div
                  class="translate-z-0 absolute inset-0 rounded-full bg-surface-800 blur-[80px]"
                ></div>
              </div>
              <div class="flex h-full flex-col items-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div
                    class="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-primary-600 blur-3xl"
                    aria-hidden="true"
                  ></div>
                  <IconCalamari
                    class="h-[150px] w-[150px] text-surface-800 dark:text-surface-200"
                  />
                </div>
                <!-- Text -->
                <div class="mb-5 grow">
                  <h2
                    class="mb-1 text-2xl font-bold text-surface-800 dark:text-surface-200"
                  >
                    Calamari
                  </h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">
                    Line based ATR Engine based on OCRopy.
                  </p>
                </div>
                <Button severity="contrast">Open</Button>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard>
            <div
              class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-surface-0 p-6 pb-8 dark:bg-surface-900"
            >
              <!-- Radial gradient -->
              <div
                class="aspect-square pointer-events-none absolute bottom-0 left-1/2 -z-10 w-1/2 -translate-x-1/2 translate-y-1/2"
                aria-hidden="true"
              >
                <div
                  class="translate-z-0 absolute inset-0 rounded-full bg-surface-800 blur-[80px]"
                ></div>
              </div>
              <div
                class="align-center flex h-full flex-col items-center text-center"
              >
                <!-- Image -->
                <div class="relative inline-flex">
                  <div
                    class="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-primary-600 blur-3xl"
                    aria-hidden="true"
                  ></div>
                  <KrakenIcon
                    class="h-[150px] w-[150px] text-surface-800 dark:text-surface-200"
                  />
                </div>
                <!-- Text -->
                <div class="mb-5 grow">
                  <h2
                    class="mb-1 text-2xl font-bold text-surface-800 dark:text-surface-200"
                  >
                    Kraken
                  </h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">
                    OCR engine for all the languages.
                  </p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">
                  Coming Soon
                </p>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard>
            <div
              class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-surface-0 p-6 pb-8 dark:bg-surface-900"
            >
              <!-- Radial gradient -->
              <div
                class="aspect-square pointer-events-none absolute bottom-0 left-1/2 -z-10 w-1/2 -translate-x-1/2 translate-y-1/2"
                aria-hidden="true"
              >
                <div
                  class="translate-z-0 absolute inset-0 rounded-full bg-surface-800 blur-[80px]"
                ></div>
              </div>
              <div class="flex h-full flex-col items-center text-center">
                <!-- Image -->
                <div class="relative inline-flex">
                  <div
                    class="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-primary-600 blur-3xl"
                    aria-hidden="true"
                  ></div>
                  <TesseractIcon
                    class="h-[150px] w-[150px] text-surface-800 dark:text-surface-200"
                  />
                </div>
                <!-- Text -->
                <div class="mb-5 grow">
                  <h2
                    class="mb-1 text-xl font-bold text-surface-800 dark:text-surface-200"
                  >
                    Tesseract
                  </h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">
                    Fast and battle-tested OCR engine.
                  </p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">
                  Coming Soon
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Spotlight>
      </section>
      <section
        v-else-if="category === 'Document Layout Analysis'"
        class="flex-col space-y-12"
      >
        <Spotlight
          class="group mx-auto grid max-w-sm grid-cols-1 content-center items-start gap-6 lg:max-w-none xl:grid-cols-2"
        >
          <SpotlightCard>
            <div
              class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-surface-0 p-6 pb-8 dark:bg-surface-900"
            >
              <!-- Radial gradient -->
              <div
                class="aspect-square pointer-events-none absolute bottom-0 left-1/2 -z-10 w-1/2 -translate-x-1/2 translate-y-1/2"
                aria-hidden="true"
              >
                <div
                  class="translate-z-0 absolute inset-0 rounded-full bg-surface-800 blur-[80px]"
                ></div>
              </div>
              <div
                class="align-center flex h-full flex-col items-center text-center"
              >
                <!-- Image -->
                <div class="relative inline-flex">
                  <div
                    class="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-primary-600 blur-3xl"
                    aria-hidden="true"
                  ></div>
                  <KrakenIcon
                    class="h-[150px] w-[150px] text-surface-800 dark:text-surface-200"
                  />
                </div>
                <!-- Text -->
                <div class="mb-5 grow">
                  <h2
                    class="mb-1 text-2xl font-bold text-surface-800 dark:text-surface-200"
                  >
                    Kraken
                  </h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">
                    Bottom-up Document Layout Analyis Engine.
                  </p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">
                  Coming Soon
                </p>
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard>
            <div
              class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-surface-0 p-6 pb-8 dark:bg-surface-900"
            >
              <!-- Radial gradient -->
              <div
                class="aspect-square pointer-events-none absolute bottom-0 left-1/2 -z-10 w-1/2 -translate-x-1/2 translate-y-1/2"
                aria-hidden="true"
              >
                <div
                  class="translate-z-0 absolute inset-0 rounded-full bg-surface-800 blur-[80px]"
                ></div>
              </div>
              <div
                class="align-center flex h-full flex-col items-center text-center"
              >
                <!-- Image -->
                <div class="relative inline-flex">
                  <div
                    class="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-primary-600 blur-3xl"
                    aria-hidden="true"
                  ></div>
                  <EynollahIcon
                    class="h-[150px] w-[150px] text-surface-800 dark:text-surface-200"
                  />
                </div>
                <!-- Text -->
                <div class="mb-5 grow">
                  <h2
                    class="mb-1 text-2xl font-bold text-surface-800 dark:text-surface-200"
                  >
                    Eynollah
                  </h2>
                  <p class="text-md text-surface-700 dark:text-surface-500">
                    Document Layout Analysis with Deep Learning and Heuristics.
                  </p>
                </div>
                <p class="text-surface-700 dark:text-surface-300">
                  Coming Soon
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Spotlight>
      </section>
    </div>
  </ComponentContainer>
</template>
