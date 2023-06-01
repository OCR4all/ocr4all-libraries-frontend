import { defineStore } from "pinia";
import { RemovableRef } from "@vueuse/core";
interface IUiStore {
  sidebarCtaVisible: RemovableRef<boolean>;
  tourSpeedDialVisible: boolean;
}
export const useUiStore = defineStore({
  id: "ui",
  state: (): IUiStore => ({
    sidebarCtaVisible: useStorage("pinia/ui/sidebarCtaVisible", true),
    tourSpeedDialVisible: false,
  }),
  actions: {},
});
