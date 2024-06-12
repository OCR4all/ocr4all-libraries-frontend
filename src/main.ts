import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { plugin, defaultConfig } from '@formkit/vue'
import formkitConfig from '@/formkit.config'

import { createApp } from "vue";
import App from "./App.vue";

import "./assets/css/base.css";

import router from "./router";

import { VueQueryPlugin } from "@tanstack/vue-query";
// PrimeVue imports
import PrimeVue from "primevue/config";
import { usePrimeVue } from 'primevue/config';
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";
import "primeicons/primeicons.css";
import ocr4all from "./presets/ocr4all";


import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import BadgeDirective from "primevue/badgedirective";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import { FocusTrap } from "@headlessui/vue";
import AnimateOnScroll from "primevue/animateonscroll";

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

app.use(PrimeVue, { ripple: true, unstyled: true, pt: ocr4all });
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.directive('focustrap', FocusTrap);
app.directive('animateonscroll', AnimateOnScroll);

app.use(VueQueryPlugin);
app.use(i18n);
app.use(createPinia());
app.use(ToastService);
app.use(router);
app.use(plugin, defaultConfig(formkitConfig));
app.use(autoAnimatePlugin)

app.mount("#app");
