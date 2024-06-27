export const profileSchema = ref([
  {
    $formkit: "primeInputText",
    name: "login",
    label: "Login",
    validation: "required",
    icon: "pi pi-user",
    iconPosition: "left",
    help: "Name used for login.",
  },
  {
    $formkit: "primeInputText",
    name: "name",
    label: "Name",
    validation: "",
    icon: "pi pi-id-card",
    iconPosition: "left",
    help: "Display name.",
  },
  {
    $formkit: "primeInputText",
    name: "email",
    label: "Mail",
    icon: "pi pi-envelope",
    validation: "email",
    iconPosition: "left",
  },
  {
    $formkit: "primeSelect",
    name: "state",
    label: "State",
    optionLabel: "label",
    optionValue: "value",
    options: [
      {
        label: "Active",
        value: "active",
      },
      {
        label: "Disabled",
        value: "disabled",
      },
    ],
    help: "State of the account",
  },
]);
