import { defineStore } from "pinia";
import { RemovableRef } from "@vueuse/core";
import { IBreadcrumb } from "@/components/Layout/Breadcrumb/Breadcrumb.interface";

interface IUiStore {
  sidebarCtaVisible: RemovableRef<boolean>;
  tourSpeedDialVisible: boolean;
  settingsDialogOpen: boolean;
  repositoryDataViewLayout: RemovableRef<string>;
  /*breadcrumb: RemovableRef<IBreadcrumb> | undefined;*/
  breadcrumb: string;
}

export const useUiStore = defineStore({
  id: "ui",
  state: (): IUiStore => ({
    sidebarCtaVisible: useStorage("pinia/ui/sidebarCtaVisible", true),
    tourSpeedDialVisible: false,
    settingsDialogOpen: false,
    repositoryDataViewLayout: useStorage(
      "pinia/ui/repositoryDataViewLayout",
      "grid",
    ),
    breadcrumb: "",
  }),
  actions: {
    flush() {
      this.breadcrumb = "";
    },
  },
});
