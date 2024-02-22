export default {
  root: {
    class: "relative inline-block",
  },
  button: {
    class: [
      "flex items-center justify-center",
      "absolute",
      "inset-0 opacity-0 transition-opacity duration-300",
      "bg-transparent text-surface-100",
      "hover:opacity-100 hover:cursor-pointer hover:bg-surface-900 hover:bg-opacity-50",
    ],
  },
  mask: {
    class: [
      "flex items-center justify-center",
      "fixed top-0 left-0",
      "w-full h-full",
      "bg-surface-900/90",
    ],
  },
  toolbar: {
    class: ["flex", "absolute top-0 right-0", "p-4"],
  },
  rotaterightbutton: {
    class: [
      "z-20",
      "flex justify-center items-center",
      "w-12 h-12",
      "mr-2",
      "rounded-full",
      "text-white bg-surface-950/50",
      "hover:text-white hover:bg-surface-950/80",
      "focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50",
      "transition duration-200 ease-in-out",
    ],
  },
  rotaterighticon: {
    class: "w-6 h-6",
  },
  rotateleftbutton: {
    class: [
      "z-20",
      "flex justify-center items-center",
      "w-12 h-12",
      "mr-2",
      "rounded-full",
      "text-white bg-transparent bg-surface-950/50",
      "hover:text-white hover:bg-surface-950/80",
      "focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50",
      "transition duration-200 ease-in-out",
    ],
  },
  rotatelefticon: {
    class: "w-6 h-6",
  },
  zoomoutbutton: {
    class: [
      "z-20",
      "flex justify-center items-center",
      "w-12 h-12",
      "mr-2",
      "rounded-full",
      "text-white bg-transparent bg-surface-950/50",
      "hover:text-white hover:bg-surface-950/80",
      "focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50",
      "transition duration-200 ease-in-out",
    ],
  },
  zoomouticon: {
    class: "w-6 h-6 ",
  },
  zoominbutton: {
    class: [
      "z-20",
      "flex justify-center items-center",
      "w-12 h-12",
      "mr-2",
      "rounded-full",
      "text-white bg-transparent bg-surface-950/50",
      "hover:text-white hover:bg-surface-950/80",
      "focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50",
      "transition duration-200 ease-in-out",
    ],
  },
  zoominicon: {
    class: "w-6 h-6",
  },
  closebutton: {
    class: [
      "z-20",
      "flex justify-center items-center",
      "w-12 h-12",
      "mr-2",
      "rounded-full",
      "text-white bg-transparent bg-surface-950/50",
      "hover:text-white hover:bg-surface-950/80",
      "focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50",
      "transition duration-200 ease-in-out",
    ],
  },
  closeicon: {
    class: "w-6 h-6",
  },
  transition: {
    enterFromClass: "opacity-0 scale-75",
    enterActiveClass: "transition-all duration-150 ease-in-out",
    leaveActiveClass: "transition-all duration-150 ease-in",
    leaveToClass: "opacity-0 scale-75",
  },
};
