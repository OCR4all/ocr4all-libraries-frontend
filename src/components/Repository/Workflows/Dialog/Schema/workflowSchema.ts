export const workflowSchema = ref([
  {
    $formkit: "primeInputText",
    name: "label",
    label: "Label",
    validation: "required",
  },
  {
    $formkit: "primeInputText",
    name: "id",
    label: "ID",
    validation: "required",
    help: "Display name.",
    disabled: true
  },
  {
    $formkit: "primeTextarea",
    name: "description",
    label: "Description",
  },
]);
