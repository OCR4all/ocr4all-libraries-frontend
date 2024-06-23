export const userSchema = ref([
  {
    $formkit: 'primeInputText',
    name: 'login',
    label: 'Login',
    validation: 'required',
    icon: "pi pi-user",
    iconPosition: "left",
    help: "Name used for login."
  },
  {
    $formkit: 'primeInputText',
    name: 'name',
    label: 'Name',
    validation: 'required',
    icon: "pi pi-id-card",
    iconPosition: "left",
    help: "Display name."
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
        value: "active"
      },
      {
        label: "Disabled",
        value: "disabled"
      },
    ],
    validation: "required",
    help: "State of the account"
  },
  {
    $formkit: "primePassword",
    name: "password",
    label: "Password",
    help: "Enter a password",
    feedback: true
  },
  {
    $formkit: "primePassword",
    name: "password_confirm",
    label: "Confirm password",
    help: "Enter the password again.",
    validation: "required|confirm",
    validationLabel: "password confirmation"
  }
])