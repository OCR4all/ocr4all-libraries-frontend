export default {
  root: ({ props }) => ({
    class: [
      "inline-flex relative",
      {
        "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  panel: {
    class: [
      "p-3",
      "border-0 dark:border",
      "shadow-md rounded-md",
      "bg-surface-0 dark:bg-surface-800",
      "text-surface-700 dark:text-white/80",
      "dark:border-surface-700",
    ],
  },
  meter: {
    class: [
      "overflow-hidden",
      "relative",
      "border-0",
      "h-2",
      "rounded-md",
      "mb-2",
      "bg-surface-100 dark:bg-surface-700",
    ],
  },
  meterlabel: ({ instance }) => {
    let _a, _b, _c;
    return {
      class: [
        // Size
        "h-full",
        // Colors
        {
          "bg-red-500 dark:bg-red-400/50":
            ((_a = instance == null ? void 0 : instance.meter) == null
              ? void 0
              : _a.strength) == "weak",
          "bg-orange-500 dark:bg-orange-400/50":
            ((_b = instance == null ? void 0 : instance.meter) == null
              ? void 0
              : _b.strength) == "medium",
          "bg-green-500 dark:bg-green-400/50":
            ((_c = instance == null ? void 0 : instance.meter) == null
              ? void 0
              : _c.strength) == "strong",
        },
        // Transitions
        "transition-all duration-1000 ease-in-out",
      ],
    };
  },
  showicon: {
    class: [
      "absolute top-1/2 right-3 -mt-2",
      "text-surface-600 dark:text-white/70",
    ],
  },
  hideicon: {
    class: [
      "absolute top-1/2 right-3 -mt-2",
      "text-surface-600 dark:text-white/70",
    ],
  },
  input: {
    root: ({ props, context, parent }) => ({
      class: [
        // Font
        "font-sans leading-6",
        // Flex
        { "flex-1 w-[1%]": parent.instance.$name == "InputGroup" },
        // Spacing
        "m-0",
        {
          "py-3 px-4 text-lg sm:text-md": props.size == "large",
          "py-1 px-2 sm:text-sm": props.size == "small",
          "py-1.5 px-3 sm:text-sm": props.size == null,
        },
        // Colors
        "text-surface-900 dark:text-surface-0",
        "placeholder:text-surface-400 dark:placeholder:text-surface-500",
        "bg-surface-0 dark:bg-surface-800",
        "shadow-sm",
        {
          "ring-1 ring-inset ring-surface-300 dark:ring-surface-700 ring-offset-0":
            parent.instance.$name !== "InputGroup",
        },
        // Shape
        { "rounded-md": parent.instance.$name !== "InputGroup" },
        {
          "first:rounded-l-md rounded-none last:rounded-r-md":
            parent.instance.$name == "InputGroup",
        },
        {
          "border-0 border-y border-l last:border-r border-surface-300 dark:border-surface-600":
            parent.instance.$name == "InputGroup",
        },
        {
          "first:ml-0 ml-[-1px]":
            parent.instance.$name == "InputGroup" && !props.showButtons,
        },
        "appearance-none",
        // Interactions
        {
          "outline-none focus:ring-primary-500 dark:focus:ring-primary-400":
            !context.disabled,
          "opacity-60 select-none pointer-events-none cursor-default":
            context.disabled,
        },
      ],
    }),
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
