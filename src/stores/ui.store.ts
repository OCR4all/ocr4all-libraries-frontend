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
  language: RemovableRef<string>;
}

export const useUiStore = defineStore({
  id: "ui",
  state: (): IUiStore => ({
    sidebarCtaVisible: useStorage("ocr4all/store/ui/sidebar-cta-visible", true),
    sidebarMinimized: useStorage("ocr4all/store/ui/sidebar-minimized", false),
    cookieBannerVisible: useStorage("ocr4all/store/ui/cookie-banner-visible", true),
    tourSpeedDialVisible: false,
    repositoryDataViewLayout: useStorage(
      "ocr4all/store/ui/repository-dataview-layout",
      "grid",
    ),
    language: useStorage("ocr4all/store/ui/language", "en"),
    breadcrumb: undefined,
  }),
  actions: {
    flush() {
      this.breadcrumb = undefined;
      useHead({
        title: "",
        titleTemplate: "%s %separator %siteName",
        templateParams: { separator: "|", siteName: "OCR4all" },
        bodyAttrs: { class: { overflow: true } },
      });
    },
  },
});
