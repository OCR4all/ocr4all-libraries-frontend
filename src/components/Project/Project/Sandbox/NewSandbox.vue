<script setup lang="ts">
const router = useRouter()

const steps = [{ label: "Images" }, { label: "Workflow" }];
const step = ref(0);

function back() {
  step.value -= 1;
}
function next() {
  step.value += 1;
}

const project = router.currentRoute.value.params.project;

const breadcrumbHome = { to: "/project/overview", label: "Projects" };
const breadcrumbPath = [{ to: `/project/${project}/view`, label: project }]
const breadcrumbCurrent = { label: "New Result" };
</script>

<template>
  <BreadcrumbNavigation :home="breadcrumbHome" :path="breadcrumbPath" :current="breadcrumbCurrent" />
  <div
    class="rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-zinc-800"
  >
    <section id="stepper" class="p-20">
      <div
        class="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-200 dark:after:bg-gray-400"
      >
        <ol class="relative z-10 flex justify-between text-sm font-medium">
          <li
            v-for="(stepData, index) in steps"
            :key="index"
            class="flex items-center gap-2 bg-white p-2 dark:bg-zinc-800"
          >
            <span
              class="h-6 w-6 rounded-full text-center text-[10px]/6 font-bold text-gray-500"
              :class="{
                'bg-blue-600': index === step,
                'text-white': index === step,
                'bg-gray-100': index !== step,
              }"
            >
              {{ index + 1 }}
            </span>

            <span class="hidden text-gray-500 dark:text-gray-100 sm:block">
              {{ stepData.label }}
            </span>
          </li>
        </ol>
      </div>
    </section>
    <section
      v-if="step === 0"
      class="flex items-center justify-center pb-10 pt-0 dark:text-gray-100"
    >
      <SandboxImportImages @next="next" />
    </section>
    <section v-if="step === 1">
      <SandboxRunWorkflow @next="next" @back="back" />
    </section>
  </div>
</template>
