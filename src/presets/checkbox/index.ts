export default {
  root: {
    class: [
      "relative",
      "inline-flex",
      "align-bottom",
      "w-4",
      "h-4",
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
};
