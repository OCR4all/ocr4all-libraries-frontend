import { useCustomFetch } from "@/composables/useCustomFetch";

const groups = ref()

await useCustomFetch("/administration/security/group/list")
    .get()
    .json()
    .then((response) => {
        groups.value = response.data.value
    });

export const groupSchema = ref([
    {
        "$formkit": "primeMultiSelect",
        "name": "groups",
        "label": "Groups",
        "filter": true,
        "placeholder": "Please select",
        "optionLabel": "name",
        "optionValue": "label",
        "options": groups.value,
    }
])