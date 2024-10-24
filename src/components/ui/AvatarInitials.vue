<script setup lang="ts">
import { stringToColour } from "@/utils/colors";

enum Size {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
}

const props = defineProps<{
  name: string;
  admin: boolean;
  size?: Size;
  selectable?: boolean;
}>();

const initials = computed(() => {
  const nameParts = props.name.toUpperCase().split(" ");
  return `${nameParts[0].charAt(0)}${nameParts[1] ? nameParts[1].charAt(0) : ""}`;
});

const getSize = computed(() => {
  switch (props.size) {
    case Size.xs:
      return "h-4 w-4";
    case Size.sm:
      return "h-6 w-6";
    case Size.md:
      return "h-8 w-8";
    case Size.lg:
      return "h-10 w-10";
    case Size.xl:
      return "h-12 w-12";
    default:
      return "h-8 w-8";
  }
});

const getTextSize = computed(() => {
  switch (props.size) {
    case Size.xs:
      return "text-[0.4rem]";
    case Size.sm:
      return "text-[0.6rem]";
    case Size.md:
      return "text-[0.8rem]";
    case Size.lg:
      return "text-[1rem]";
    case Size.xl:
      return "text-[1.2rem]";
    default:
      return "text-[0.8rem]";
  }
});

const isSelectable = computed(() => {
  if (props.selectable) return "hover:ring-2";
});
</script>
<template>
  <div
    class="flex items-center justify-center rounded-full px-2"
    :class="[getSize, isSelectable]"
    :style="{ 'background-color': stringToColour(props.name) }"
  >
    <span class="font-medium text-white" :class="getTextSize">
      {{ initials }}
    </span>
  </div>
</template>
