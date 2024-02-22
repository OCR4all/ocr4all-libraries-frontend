export default {
  root: {
    class: [
      "inline-flex items-center",
      "px-2 py-0.5",
      "rounded-[1.14rem]",
      "text-surface-700 dark:text-surface-0/70",
      "bg-surface-200 dark:bg-surface-700",
    ],
  },
  label: {
    class: "text-xs leading-6 mx-0",
  },
  icon: {
    class: "leading-6 mr-2",
  },
  image: {
    class: ["w-6 h-6 mr-2", "rounded-full"],
  },
  removeIcon: {
    class: [
      "rounded-md leading-6",
      "ml-2",
      "w-4 h-4",
      "transition duration-200 ease-in-out",
      "cursor-pointer",
    ],
  },
};
