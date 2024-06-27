import { defineStore } from "pinia";
import { RemovableRef } from "@vueuse/core";
import { IBreadCrumbEntry } from "@/components/Layout/Breadcrumb/Breadcrumb.interface";

interface IUiStore {
  sidebarCtaVisible: RemovableRef<boolean>;
  sidebarMinimized: RemovableRef<boolean>;
  cookieBannerVisible: RemovableRef<boolean>;
  tourSpeedDialVisible: boolean;
  repositoryDataViewLayout: RemovableRef<string>;
  breadcrumb: RemovableRef<IBreadCrumbEntry[]> | undefined;
}

export const useUiStore = defineStore({
  id: "ui",
  state: (): IUiStore => ({
    sidebarCtaVisible: useStorage("pinia/ui/sidebarCtaVisible", true),
    sidebarMinimized: useStorage("pinia/ui/sidebarMinimized", false),
    cookieBannerVisible: useStorage("pinia/ui/cookieBannerVisible", true),
    tourSpeedDialVisible: false,
    repositoryDataViewLayout: useStorage(
      "pinia/ui/repositoryDataViewLayout",
      "grid",
    ),
    breadcrumb: undefined,
  }),
  actions: {
    flush() {
      this.breadcrumb = undefined;
      useHead({
        title: '',
        titleTemplate: '%s %separator %siteName',
        templateParams: { separator: '|', siteName: 'OCR4all' },
        bodyAttrs: { class: { overflow: true } },
      })
    },
  },
});
