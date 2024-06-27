export function buildProcessorSchema(data) {
  const processorSchema = [];

  for (const entry of data.entries) {
    console.log(entry);
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
        processorSchema.push({
          $formkit: "primeSelect",
          id: entry.argument,
          name: entry.argument,
          label: entry.label,
          value: entry.value,
          showClear: true,
          filter: true,
          help: entry.description,
          optionLabel: "value",
          optionValue: "value",
          options: entry.items,
        });
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

  console.log(data);

  return [
    {
      $el: "div",
      attrs: {
        class: "grid grid-cols-1",
      },
      children: processorSchema,
    },
  ];
}
