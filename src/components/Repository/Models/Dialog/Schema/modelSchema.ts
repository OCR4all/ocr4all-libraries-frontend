import { RemovableRef } from "@vueuse/core";

const list: RemovableRef<string[]> = ref([]);

export const modelSchema = ref([
    {
        $formkit: "primeInputText",
        name: "name",
        label: "Name",
        validation: "required",
    },
    {
        $formkit: "primeTextarea",
        name: "description",
        label: "Description",
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
]);
