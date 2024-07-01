export const appearance = ref([
    {
        "$formkit": "primeSelectButton",
        "label": "Theme",
        "name": "selectButton",
        "options": [
            {
                "label": "Light",
                "value": "light"
            },
            {
                "label": "Dark",
                "value": "dark"
            },
        ],
        "optionLabel": "label",
        "optionValue": "value",
        "value": "light",
        "unselectable": false
    },
    {
        "$formkit": "primeColorPicker",
        "name": "primary",
        "label": "Primary Color",
        "inline": true,
        "format": "rgb"
    },
]);
