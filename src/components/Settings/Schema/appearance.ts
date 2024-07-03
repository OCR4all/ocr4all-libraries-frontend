const isDark = useDark()

export const appearance = ref([
    {
        "$formkit": "primeSelectButton",
        "label": "Theme",
        "name": "darkMode",
        "options": [
            {
                "label": "Light",
                "value": false
            },
            {
                "label": "Dark",
                "value": true
            },
        ],
        "optionLabel": "label",
        "optionValue": "value",
        "value": isDark,
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
