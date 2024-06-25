import { useCustomFetch } from "@/composables/useCustomFetch";

const users = ref([])

await useCustomFetch(`/administration/security/user/list`)
  .get()
  .json()
  .then((response) => {
      for(const user of response.data.value){
          users.value.push({login: user.login, state: user.state})
      }
  });

export const groupSchema = ref([
    {
        $formkit: 'primeInputText',
        name: 'label',
        label: 'Label',
        validation: 'required',
        icon: "pi pi-user",
        iconPosition: "left",
        help: "Group label."
    },
    {
        $formkit: 'primeInputText',
        name: 'name',
        label: 'Name',
        validation: 'required',
        icon: "pi pi-id-card",
        iconPosition: "left",
        help: "Group display name."
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
                label: "Blocked",
                value: "blocked"
            },
        ],
        validation: "required",
        help: "State of the group"
    },
    {
        "$formkit": "primeMultiSelect",
        "name": "users",
        "label": "Users",
        "filter": true,
        "placeholder": "Please select",
        "optionLabel": "login",
        "optionValue": "login",
        "options": users.value,
    }
])
