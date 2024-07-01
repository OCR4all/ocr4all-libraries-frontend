export const generalInformation = ref([
  {
    "$el": "div",
    "if": "true",
    "attrs": {
      "class": "grid grid-cols-1 sm:grid-cols-2"
    },
    "children": [
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
  ]}
]);
