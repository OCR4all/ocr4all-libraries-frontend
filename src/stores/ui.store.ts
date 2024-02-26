import { defineStore } from "pinia";
import { RemovableRef } from "@vueuse/core";
interface IUiStore {
  sidebarCtaVisible: RemovableRef<boolean>;
  tourSpeedDialVisible: boolean;
  settingsDialogOpen: boolean;
  repositoryDataViewLayout: RemovableRef<string>;
}
export const useUiStore = defineStore({
  id: "ui",
  state: (): IUiStore => ({
    sidebarCtaVisible: useStorage("pinia/ui/sidebarCtaVisible", true),
    tourSpeedDialVisible: false,
    settingsDialogOpen: false,
    repositoryDataViewLayout: useStorage("pinia/ui/repositoryDataViewLayout", "grid")
  }),
  actions: {},
});
