export const passwordSchema = ref([
  {
    $formkit: "primePassword",
    name: "password",
    label: "Password",
    help: "Enter a new password",
    feedback: true,
  },
  {
    $formkit: "primePassword",
    name: "password_confirm",
    label: "Confirm password",
    help: "Enter the new password again.",
    validation: "required|confirm",
    validationLabel: "password confirmation",
  },
]);
