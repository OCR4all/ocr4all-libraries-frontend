export default {
  root: ({ props, state }) => ({
    class: [
      // Display and Position
      "inline-flex",
      "relative",
      // Shape
      "rounded-md",
      "shadow-sm",
      // Color and Background
      "bg-surface-0 dark:bg-surface-800",
      // States
      {
        "ring-1 ring-inset ring-surface-300 dark:ring-surface-700":
          !state.focused,
        "ring-2 ring-inset ring-primary-500 dark:ring-primary-400":
          state.focused,
      },
      // Misc
      "cursor-default",
      "select-none",
      { "opacity-60": props.disabled, "pointer-events-none": props.disabled },
    ],
  }),
  input: ({ props }) => ({
    class: [
      //Font
      "font-sans",
      "leading-6",
      "sm:text-sm",
      // Display
      "block",
      "flex-auto",
      // Color and Background
      "bg-transparent",
      "border-0",
      {
        "text-surface-800 dark:text-white/80": props.modelValue != null,
        "text-surface-400 dark:text-surface-500": props.modelValue == null,
      },
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",
      // Sizing and Spacing
      "w-[1%]",
      "py-1.5 px-3",
      { "pr-7": props.showClear },
      //Shape
      "rounded-none",
      // Transitions
      "transition",
      "duration-200",
      // States
      "focus:outline-none focus:shadow-none",
      // Misc
      "relative",
      "cursor-pointer",
      "overflow-hidden overflow-ellipsis",
      "whitespace-nowrap",
      "appearance-none",
    ],
  }),
  trigger: {
    class: [
      "sm:text-sm",
      "flex items-center justify-center",
      "shrink-0",
      "bg-transparent",
      "text-surface-500",
      "w-12",
      "rounded-tr-md",
      "rounded-br-md",
    ],
  },
  panel: {
    class: [
      "absolute top-0 left-0",
      "mt-2",
      "border-0",
      "rounded-md",
      "shadow-md",
      "bg-surface-0 dark:bg-surface-800",
      "text-surface-800 dark:text-white/80",
      "ring-1 ring-inset ring-surface-300 dark:ring-surface-700",
    ],
  },
  wrapper: {
    class: ["max-h-[15rem]", "overflow-auto"],
  },
  list: {
    class: "py-1 list-none m-0",
  },
  item: ({ context }) => ({
    class: [
      // Font
      "sm:text-sm",
      "leading-none",
      { "font-normal": !context.selected, "font-bold": context.selected },
      // Position
      "relative",
      // Shape
      "border-0",
      "rounded-none",
      // Spacing
      "m-0",
      "py-2 px-4",
      // Color
      {
        "text-surface-700 dark:text-white/80":
          !context.focused && !context.selected && !context.disabled,
      },
      {
        "text-surface-600 dark:text-white/70":
          !context.focused && !context.selected && context.disabled,
      },
      {
        "bg-surface-200 dark:bg-surface-600/60 text-surface-700 dark:text-white/80":
          context.focused && !context.selected,
      },
      {
        "bg-primary-500 dark:bg-primary-400 text-white dark:text-surface-700":
          context.focused && context.selected,
      },
      {
        "bg-transparent text-surface-700 dark:text-white/80":
          !context.focused && context.selected,
      },
      //States
      "hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white dark:hover:text-surface-700",
      "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      // Misc
      { "pointer-events-none cursor-default": context.disabled },
      { "cursor-pointer": !context.disabled },
      "overflow-hidden",
      "whitespace-nowrap",
    ],
  }),
  itemgroup: {
    class: [
      "font-bold",
      "sm:text-sm",
      "m-0",
      "py-2 px-4",
      "text-surface-800 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-600/80",
      "cursor-auto",
    ],
  },
  emptymessage: {
    class: [
      "leading-none",
      "sm:text-sm",
      "py-2 px-4",
      "text-surface-800 dark:text-white/80",
      "bg-transparent",
    ],
  },
  header: {
    class: [
      "p-0",
      "m-0",
      "rounded-tl-md",
      "rounded-tr-md",
      "text-surface-700 dark:text-white/80",
      "bg-surface-100 dark:bg-surface-800",
    ],
  },
  filtercontainer: {
    class: "relative",
  },
  filterinput: {
    class: [
      "font-sans",
      "leading-none",
      "sm:text-sm",
      "py-1.5 px-3",
      "pr-7",
      "-mr-7",
      "w-full",
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-800",
      "placeholder:text-surface-400",
      "ring-1 ring-inset ring-surface-300 dark:ring-surface-700",
      "border-0",
      "rounded-tl-md",
      "rounded-tr-md",
      "appearance-none",
      "focus:ring-2 focus:ring-inset focus:outline-none focus:outline-offset-0",
      "focus:ring-primary-600 dark:focus:ring-primary-500",
      "appearance-none",
    ],
  },
  filtericon: {
    class: ["absolute", "top-1/2 right-3", "-mt-2"],
  },
  clearicon: {
    class: ["text-surface-500", "absolute", "top-1/2", "right-12", "-mt-2"],
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
