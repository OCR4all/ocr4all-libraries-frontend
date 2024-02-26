<script setup lang="ts">
import BreadcrumbNavigation from "@/components/Layout/BreadcrumbNavigation.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const steps = [
  { label: t("pages.projects.new.stepper.name") },
  { label: t("pages.projects.new.stepper.metadata") },
  { label: t("pages.projects.new.stepper.images") },
];
const step = ref(0);
function back() {
  step.value -= 1;
}
function next() {
  step.value += 1;
}

const breadcrumbHome = { to: "/project/overview", label: "Projects" };
const breadcrumbCurrent = { label: "New" };
</script>

<template>
  <BreadcrumbNavigation :home="breadcrumbHome" :current="breadcrumbCurrent" />
  <div
    class="rounded-md bg-white shadow-md dark:border dark:border-surface-700 dark:bg-zinc-800"
  >
    <section id="stepper" class="p-20">
      <div
        class="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-md after:bg-surface-200 dark:after:bg-surface-500"
      >
        <ol class="relative z-10 flex justify-between text-sm font-medium">
          <li
            v-for="(stepData, index) in steps"
            :key="index"
            class="flex items-center gap-2 bg-white p-2 dark:bg-zinc-800"
          >
            <span
              class="h-6 w-6 rounded-full text-center text-[10px]/6 font-bold text-surface-500"
              :class="{
                'bg-primary-600': index === step,
                'text-white': index === step,
                'bg-surface-100': index !== step,
              }"
            >
              {{ index + 1 }}
            </span>

            <span
              class="hidden text-surface-500 dark:text-surface-100 sm:block"
            >
              {{ stepData.label }}
            </span>
          </li>
        </ol>
      </div>
    </section>
    <section
      v-if="step === 0"
      class="flex items-center justify-center dark:text-surface-100 sm:p-24"
    >
      <ProjectCreationNameChooser @next="next" />
    </section>
    <section v-if="step === 1">
      <ProjectCreationMetadata @next="next" @back="back" />
    </section>
    <section v-if="step === 2">
      <ProjectCreationImageSelection />
    </section>
  </div>
</template>
