export default {
  wrapper: {
    class: ["h-full w-full", "z-[1]", "overflow-hidden", "relative float-left"],
  },
  content: {
    class: [
      "h-[calc(100%+12px)] w-[calc(100%+12px)] pr-[12px] pb-[12px] pl-0 pt-0",
      "overflow-scroll scrollbar-none",
      "box-border",
      "relative",
      "[&::-webkit-scrollbar]:hidden",
    ],
  },
  barX: {
    class: [
      "h-[6px] bottom-0",
      "bg-surface-100 dark:bg-surface-700 rounded",
      "cursor-pointer",
      "invisible z-20",
      "transition duration-[250ms] ease-linear",
      "relative",
    ],
  },
  barY: {
    class: [
      "w-[6px] top-0",
      "bg-surface-100 dark:bg-surface-700 rounded",
      "cursor-pointer",
      "z-20",
      "transition duration-[250ms] ease-linear",
      "relative",
    ],
  },
};
