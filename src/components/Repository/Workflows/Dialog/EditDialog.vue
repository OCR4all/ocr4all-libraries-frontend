<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { workflowSchema } from "@/components/Repository/Workflows/Dialog/Schema/workflowSchema";
import { useToast } from "primevue/usetoast";

const dialogRef = inject("dialogRef");
const toast = useToast();

const schema = workflowSchema;
const data = ref();

onMounted(() => {
  data.value = dialogRef.value.data;
});

async function updateWorkflow(values, { setErrors }) {
  const { data } = await useCustomFetch(`/workflow/list`).get().json();
  if (data.value.map((workflow) => workflow.label).includes(values.label)) {
    setErrors({
      label: "Sorry, this label is already taken.",
    });
  } else {
    const payload = {
      label: values.label,
      description: values.description,
    };
    useCustomFetch(`/workflow/update/${values.id}`)
      .post(payload)
      .then((response) => {
        if (response.error.value) {
          setErrors(["Something went wrong.", "Please try again later."]);
        } else {
          dialogRef.value.close();
        }
      });
  }
}
</script>
<template>
  <FormKit
    id="projectInformationForm"
    ref="form"
    v-model="data"
    type="form"
    @submit="updateWorkflow"
  >
    <FormKitSchema :schema="schema" :data="data" />
  </FormKit>
</template>
