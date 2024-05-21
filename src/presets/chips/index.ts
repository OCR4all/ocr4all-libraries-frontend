export default {
  root: ({ props }) => ({
    class: [
      "flex",
      {
        "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  container: ({ state }) => ({
    class: [
      // Font
      "font-sans sm:text-sm leading-none",
      // Flex
      "flex items-center flex-wrap gap-1",
      // Spacing
      "m-0 py-1 px-3",
      // Size
      "w-full",
      // Shape
      "list-none",
      "rounded-md",
      // Color
      "text-surface-900 dark:text-surface-0",
      "bg-surface-0 dark:bg-surface-800",
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",
      "shadow-sm",
      // States
      {
        "ring-1 ring-inset ring-surface-300 dark:ring-surface-700 ring-offset-0":
          !state.focused,
        "ring-2 ring-primary-500 dark:ring-primary-400": state.focused,
      },
      // Transition
      "transition-colors duration-200",
      // Misc
      "cursor-text overflow-hidden",
      "appearance-none",
    ],
  }),
  inputtoken: {
    class: ["py-0.5 px-0", "inline-flex flex-auto"],
  },
  input: {
    class: [
      "font-sans sm:text-sm leading-none",
      "w-full",
      "p-0 m-0",
      "appearance-none rounded-none",
      "border-0 outline-none",
      "text-surface-700 dark:text-white/80",
      "bg-transparent",
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",
    ],
  },
  token: {
    class: [
      "inline-flex items-center",
      "py-0.5 px-3",
      "rounded-[1.14rem]",
      "text-surface-700 dark:text-white/70",
      "bg-surface-200 dark:bg-surface-700",
    ],
  },
  label: {
    class: "leading-5",
  },
  removeTokenIcon: {
    class: [
      "rounded-md leading-6",
      "ml-2",
      "w-4 h-4",
      "transition duration-200 ease-in-out",
      "cursor-pointer",
    ],
  },
};
