import { defineStore } from "pinia";
import { IBreadCrumbEntry } from "@/components/Layout/Breadcrumb/Breadcrumb.interface";

export const useUiStore = defineStore("ui", () => {
  const sidebarCtaVisible = useStorage(
    "ocr4all/store/ui/sidebar-cta-visible",
    true,
  );
  const sidebarMinimized = useStorage(
    "ocr4all/store/ui/sidebar-minimized",
    false,
  );
  const cookieBannerVisible = useStorage(
    "ocr4all/store/ui/cookie-banner-visible",
    true,
  );
  const tourSpeedDialVisible = false;
  const repositoryDataViewLayout = useStorage(
    "ocr4all/store/ui/repository-dataview-layout",
    "grid",
  );
  const breadcrumb: Ref<undefined | IBreadCrumbEntry[]> = ref();
  function flush() {
    breadcrumb.value = undefined;
  }

  return {
    sidebarCtaVisible,
    sidebarMinimized,
    cookieBannerVisible,
    tourSpeedDialVisible,
    repositoryDataViewLayout,
    breadcrumb,
    flush,
  };
});
