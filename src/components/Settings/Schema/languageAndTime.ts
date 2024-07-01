export const languageAndTime = ref([
  {
    $formkit: "primeSelect",
    name: "language",
    label: "Language",
    optionLabel: "label",
    optionValue: "value",
    options: [
      {
        label: "🇬🇧 English",
        value: "en",
      },
      {
        label: "🇩🇪 Deutsch",
        value: "de",
      },
    ],
    validation: "required",
  },
  {
    $formkit: "primeSelect",
    name: "timezone",
    label: "Time Zone",
    optionLabel: "label",
    optionValue: "value",
    options: [

    ],
    "disabled": true
  },
]);
