import { RemovableRef } from "@vueuse/core";

const list: RemovableRef<string[]> = ref([]);

export const sandboxMetadataSchema = ref([
  {
    $formkit: "primeInputText",
    name: "name",
    label: "Name",
    validation: "required",
  },
  {
    $formkit: "primeInputText",
    name: "id",
    label: "ID",
    validation: "required",
    help: "Display name.",
    disabled: true,
  },
  {
    $formkit: "primeSelect",
    name: "state",
    label: "State",
    optionLabel: "label",
    optionValue: "value",
    value: "active",
    options: [
      {
        label: "Paused",
        value: "paused",
      },
      {
        label: "Closed",
        value: "closed",
      },
      {
        label: "Canceled",
        value: "canceled",
      },
      {
        label: "Active",
        value: "active",
      },
      {
        label: "Secured",
        value: "secured",
      },
    ],
    validation: "required",
  },
  {
    $formkit: "primeAutoComplete",
    name: "keywords",
    multiple: true,
    typeahead: false,
    complete: function search(query: string) {
      return [
        ...list.value.filter((i) =>
          i.toLowerCase().includes(query.toLowerCase()),
        ),
        query,
      ];
    },
    label: "Keywords",
  },
  {
    $formkit: "primeTextarea",
    name: "description",
    label: "Description",
  },
]);
