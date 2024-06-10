import { en, de } from '@formkit/i18n'
import { defaultConfig } from '@formkit/vue'
import { rootClasses } from '@/formkit.theme'

export default defaultConfig({
  locales: { en, de },
  locale: 'fr',
  config: {
    rootClasses
  }
})
