import { en, de } from "@formkit/i18n";
import { defaultConfig } from "@formkit/vue";
import { primeInputs } from "@sfxcode/formkit-primevue";

export default defaultConfig({
  locales: { en, de },
  locale: "en",
  inputs: primeInputs,
});
