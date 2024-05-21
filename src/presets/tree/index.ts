export default {
  root: {
    class: [
      "relative",
      "p-1.5",
      "rounded-md",
      "bg-surface-0 dark:bg-surface-800",
      "text-surface-700 dark:text-white/80",
      "ring-1 ring-surface-200 dark:ring-surface-700",
    ],
  },
  wrapper: {
    class: ["overflow-auto"],
  },
  container: {
    class: ["m-0 p-0", "list-none overflow-auto"],
  },
  node: {
    class: [
      "p-[2px]",
      "rounded-md",
      "focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400",
    ],
  },
  content: ({ context, props }) => ({
    class: [
      // Flex and Alignment
      "flex items-center",
      // Shape
      "rounded-md",
      // Spacing
      "p-2",
      // Colors
      "text-surface-700 dark:text-surface-0",
      {
        "bg-surface-100 text-primary-500 dark:bg-surface-300/10 dark:text-primary-400":
          context.selected,
      },
      // States
      {
        "hover:bg-surface-200 dark:hover:bg-surface-400/10":
          props.selectionMode == "single" || props.selectionMode == "multiple",
      },
      // Transition
      "transition-shadow duration-200",
      {
        "cursor-pointer select-none":
          props.selectionMode == "single" || props.selectionMode == "multiple",
      },
    ],
  }),
  toggler: ({ context }) => ({
    class: [
      // Flex and Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size and Spacing
      "mr-2",
      "w-6 h-6",
      // Spacing
      "mr-2",
      // Colors
      "text-surface-500",
      "bg-transparent",
      {
        invisible: context.leaf,
      },
      // States
      "hover:text-surface-700 dark:hover:text-white/80",
      "hover:bg-surface-100 dark:hover:bg-surface-800/80",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-inset",
      "focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200",
      // Misc
      "cursor-pointer select-none",
    ],
  }),
  togglericon: {
    class: ["w-4 h-4", "text-surface-500 dark:text-white/70"],
  },
  nodeCheckbox: {
    root: {
      class: [
        "relative",
        "inline-flex",
        "align-bottom",
        "w-4",
        "h-4",
        "mr-2",
        "cursor-default",
        "select-none",
      ],
    },
    box: ({ props, context }) => ({
      class: [
        // Alignment
        "flex",
        "items-center",
        "justify-center",
        // Size
        "w-4",
        "h-4",
        // Shape
        "rounded",
        "border",
        // Colors
        "text-surface-600",
        {
          "border-surface-300 bg-surface-0 dark:border-surface-700 dark:bg-surface-800":
            !context.checked,
          "border-primary-500 bg-primary-500 dark:border-primary-400 dark:bg-primary-400":
            context.checked,
        },
        {
          "ring-2 ring-primary-500 dark:ring-primary-400":
            !props.disabled && context.focused,
          "cursor-default opacity-60": props.disabled,
        },
        // States
        {
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-primary-400":
            !props.disabled,
          "cursor-default opacity-60": props.disabled,
        },
        // Transitions
        "transition-colors",
        "duration-200",
      ],
    }),
    input: {
      class: [
        "peer",
        "w-full ",
        "h-full",
        "absolute",
        "top-0 left-0",
        "z-10",
        "p-0",
        "m-0",
        "rounded",
        "border",
        "opacity-0",
        "rounded-md",
        "outline-none",
        "border-2 border-surface-300 dark:border-surface-700",
        "appareance-none",
      ],
    },
    icon: {
      class: [
        "text-normal",
        "w-3",
        "h-3",
        "text-white dark:text-surface-900",
        "transition-all",
        "duration-200",
      ],
    },
  },
  nodeicon: {
    class: ["mr-2", "text-surface-600 dark:text-white/70"],
  },
  subgroup: {
    class: ["m-0 list-none p-0 pl-2 mt-1"],
  },
  filtercontainer: {
    class: ["relative block", "mb-2", "w-full"],
  },
  input: {
    class: [
      "relative",
      "font-sans leading-6",
      "sm:text-sm",
      "m-0",
      "py-1.5 px-3 pr-10",
      "w-full",
      "rounded-md",
      "text-surface-900 dark:text-surface-0",
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",
      "bg-surface-0 dark:bg-surface-800",
      "ring-1 ring-inset ring-surface-300 dark:ring-surface-700 ring-offset-0",
      "hover:border-primary-500 dark:hover:border-primary-400",
      "focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400",
      "appearance-none",
      "transition-colors duration-200",
    ],
  },
  loadingicon: {
    class: [
      "text-surface-500 dark:text-surface-0/70",
      "absolute top-[50%] right-[50%] -mt-2 -mr-2 animate-spin",
    ],
  },
  searchicon: {
    class: [
      "absolute top-1/2 -mt-2 right-3",
      "text-surface-600 dark:hover:text-white/70",
    ],
  },
};
