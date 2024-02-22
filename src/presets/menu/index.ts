export default {
  root: {
    class: [
      "min-w-[12rem]",
      "rounded-md",
      "p-1.5",
      "bg-surface-0 dark:bg-surface-700",
      "text-surface-700 dark:text-white/80",
      "ring-1 ring-surface-200 dark:ring-surface-700",
    ],
  },
  menu: {
    class: ["list-none", "m-0", "p-0", "outline-none"],
  },
  menuitem: {
    class: ["first:mt-0 mt-1"],
  },
  content: ({ context }) => ({
    class: [
      //Shape
      "rounded-md",
      // Colors
      {
        "text-surface-700 dark:text-surface-0": !context.focused,
        "bg-surface-100 text-primary-500 dark:bg-surface-300/10 dark:text-primary-400":
          context.focused,
      },
      // Transitions
      "transition-shadow",
      "duration-200",
      // States
      "hover:text-primary-600 dark:hover:text-primary-400",
      "hover:bg-surface-100 dark:hover:bg-surface-400/10",
    ],
  }),
  action: {
    class: [
      "relative",
      "font-semibold",
      "flex",
      "items-center",
      "py-2",
      "px-3",
      "no-underline",
      "overflow-hidden",
      "cursor-pointer",
      "select-none",
    ],
  },
  icon: {
    class: ["mr-2", "leading-6", "text-sm"],
  },
  label: {
    class: ["leading-6", "text-sm"],
  },
  submenuheader: {
    class: [
      "font-semibold",
      "text-xs leading-6",
      "m-0 ",
      "py-1",
      "px-3",
      "rounded-tl-none",
      "rounded-tr-none",
      "bg-surface-0 dark:bg-surface-700",
      "text-surface-600 dark:text-surface-0/60",
    ],
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
