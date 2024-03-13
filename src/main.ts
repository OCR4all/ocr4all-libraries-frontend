import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import { createApp } from "vue";
import App from "./App.vue";

import "./assets/index.postcss";

import router from "./router";

import { VueQueryPlugin } from "@tanstack/vue-query";
// PrimeVue imports
import PrimeVue from "primevue/config";
import CPreset from "./presets";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/tailwind-light/theme.css";
import Tooltip from "primevue/tooltip";

import ToastService from "primevue/toastservice";

import VueKonva from "vue-konva";
const app = createApp(App);

const messages = Object.fromEntries(
  Object.entries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import.meta.glob<{ default: any }>("./locales/*.json", {
      eager: true,
    }),
  ).map(([key, value]) => {
    return [key.slice(10, -5), value.default];
  }),
);

const i18n = createI18n({
  legacy: false,
  locale: useStorage("ocr4all/frontend/language", "en").value,
  fallbackLocale: "en",
  warnHtmlMessage: false,
  globalInjection: true,
  messages,
});

app.use(VueKonva);
app.use(VueQueryPlugin);
app.use(i18n);
app.use(createPinia());
app.use(PrimeVue, { unstyled: true, pt: CPreset });
app.use(ToastService);
app.use(router);
app.directive("tooltip", Tooltip);

app.mount("#app");
