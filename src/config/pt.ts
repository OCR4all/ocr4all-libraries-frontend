import { usePassThrough } from "primevue/passthrough";
import Tailwind from "primevue/passthrough/tailwind";

export const CustomTailwind = usePassThrough(
  Tailwind,
  {
    datatable: {
      title: {
        class: ["leading-none font-light text-2xl"],
      },
    },
  },
  {
    mergeSections: true,
    mergeProps: false,
  },
);
