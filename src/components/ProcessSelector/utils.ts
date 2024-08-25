interface IItem {
  type: string;
  description: null | string;
  value: string;
  selected: boolean;
  disabled: boolean;
}

function collectSelection(
  items: IItem[],
  multiple: boolean,
): null | string | string[] {
  const selection = [];
  for (const item of items) {
    if (item.selected) {
      selection.push(item.value);
    }
  }
  if (selection.length === 0) return null;
  return multiple ? selection : selection[0];
}

export function buildProcessorSchema(data, grid: number = 1) {
  const processorSchema = [];

  for (const entry of data.entries) {
    switch (entry.type) {
      case "decimal":
        processorSchema.push({
          $formkit: "primeInputNumber",
          name: entry.argument,
          label: entry.label,
          value: entry.value,
          help: entry.description,
          useGrouping: false,
          minFractionDigits: 2,
        });
        break;
      case "integer":
        processorSchema.push({
          $formkit: "primeInputNumber",
          name: entry.argument,
          label: entry.label,
          value: entry.value,
          help: entry.description,
          useGrouping: false,
          maxFractionDigits: 0,
        });
        break;
      case "boolean":
        processorSchema.push({
          $formkit: "primeCheckbox",
          id: entry.argument,
          name: entry.argument,
          label: entry.label,
          help: entry.description,
          value: entry.value,
        });
        break;
      case "select":
        if (entry["multiple-options"]) {
          processorSchema.push({
            $formkit: "primeMultiSelect",
            id: entry.argument,
            name: entry.argument,
            label: entry.label,
            value: collectSelection(entry.items, true),
            showClear: true,
            filter: true,
            help: entry.description,
            optionLabel: "value",
            optionValue: "value",
            options: entry.items,
          });
        } else {
          processorSchema.push({
            $formkit: "primeSelect",
            id: entry.argument,
            name: entry.argument,
            label: entry.label,
            value: collectSelection(entry.items, false),
            showClear: true,
            filter: true,
            help: entry.description,
            optionLabel: "value",
            optionValue: "value",
            options: entry.items,
          });
        }
        break;
      case "string":
        processorSchema.push({
          $formkit: "primeInputText",
          id: entry.argument,
          name: entry.argument,
          label: entry.label,
          value: entry.value,
          help: entry.description,
        });
        break;
    }
  }
  return [
    {
      $el: "div",
      attrs: {
        class: `grid grid-cols-${grid} gap-x-4`,
      },
      children: processorSchema,
    },
  ];
}
