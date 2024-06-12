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
import AutoComplete from 'primevue/autocomplete'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import Badge from 'primevue/badge'
import BlockUI from 'primevue/blockui'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Carousel from 'primevue/carousel'
import CascadeSelect from 'primevue/cascadeselect'
import Chart from 'primevue/chart'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Chips from 'primevue/chips'
import ColorPicker from 'primevue/colorpicker'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmPopup from 'primevue/confirmpopup'
import ContextMenu from 'primevue/contextmenu'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview'
import DynamicDialog from "primevue/dynamicdialog";
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import DeferredContent from 'primevue/deferredcontent'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Editor from 'primevue/editor'
import Fieldset from 'primevue/fieldset'
import FileUpload from 'primevue/fileupload'
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import Image from 'primevue/image'
import InlineMessage from 'primevue/inlinemessage'
import Inplace from 'primevue/inplace'
import InputIcon from 'primevue/inputicon'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import InputOtp from 'primevue/inputotp'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import Knob from 'primevue/knob'
import Galleria from 'primevue/galleria'
import Listbox from 'primevue/listbox'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import OrderList from 'primevue/orderlist'
import OrganizationChart from 'primevue/organizationchart'
import OverlayPanel from 'primevue/overlaypanel'
import Paginator from 'primevue/paginator'
import Panel from 'primevue/panel'
import PanelMenu from 'primevue/panelmenu'
import Password from 'primevue/password'
import PickList from 'primevue/picklist'
import ProgressBar from 'primevue/progressbar'
import Rating from 'primevue/rating'
import RadioButton from 'primevue/radiobutton'
import SelectButton from 'primevue/selectbutton'
import ScrollPanel from 'primevue/scrollpanel'
import ScrollTop from 'primevue/scrolltop'
import Slider from 'primevue/slider'
import Sidebar from 'primevue/sidebar'
import Skeleton from 'primevue/skeleton'
import SplitButton from 'primevue/splitbutton'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Steps from 'primevue/steps'
import TabMenu from 'primevue/tabmenu'
import Tag from 'primevue/tag'
import TieredMenu from 'primevue/tieredmenu'
import Textarea from 'primevue/textarea'
import Timeline from 'primevue/timeline'
import Toast from 'primevue/toast'
import Toolbar from 'primevue/toolbar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ToggleButton from 'primevue/togglebutton'
import Tree from 'primevue/tree'
import TreeTable from 'primevue/treetable'
import TriStateCheckbox from 'primevue/tristatecheckbox'
import VirtualScroller from 'primevue/virtualscroller'

import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'

// directives
import BadgeDirective from 'primevue/badgedirective'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import Tooltip from 'primevue/tooltip'
import FocusTrap from 'primevue/focustrap'

// services
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice';
// Presets
import ocr4all from "./presets/ocr4all";

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
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

app.directive('badge', BadgeDirective)
app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)
app.directive('styleclass', StyleClass)
app.directive('focustrap', FocusTrap)

// components
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('AutoComplete', AutoComplete)
app.component('Avatar', Avatar)
app.component('AvatarGroup', AvatarGroup)
app.component('Badge', Badge)
app.component('BlockUI', BlockUI)
app.component('Breadcrumb', Breadcrumb)
app.component('Button', Button)
app.component('Calendar', Calendar)
app.component('Card', Card)
app.component('Carousel', Carousel)
app.component('CascadeSelect', CascadeSelect)
app.component('Chart', Chart)
app.component('Checkbox', Checkbox)
app.component('Chip', Chip)
app.component('Chips', Chips)
app.component('ColorPicker', ColorPicker)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('ConfirmDialog', ConfirmDialog)
app.component('ConfirmPopup', ConfirmPopup)
app.component('ContextMenu', ContextMenu)
app.component('DataTable', DataTable)
app.component('DataView', DataView)
app.component('DataViewLayoutOptions', DataViewLayoutOptions)
app.component('DeferredContent', DeferredContent)
app.component('Dialog', Dialog)
app.component('DynamicDialog', DynamicDialog)
app.component('Divider', Divider)
app.component('Dropdown', Dropdown)
app.component('Editor' , Editor)
app.component('Fieldset', Fieldset)
app.component('FileUpload', FileUpload)
app.component('FloatLabel', FloatLabel)
app.component('IconField', IconField)
app.component('Image', Image)
app.component('InlineMessage', InlineMessage)
app.component('Inplace', Inplace)
app.component('InputIcon', InputIcon)
app.component('InputMask', InputMask)
app.component('InputOtp', InputOtp)
app.component('InputNumber', InputNumber)
app.component('InputSwitch', InputSwitch)
app.component('InputText', InputText)
app.component('Galleria', Galleria)
app.component('Knob', Knob)
app.component('Listbox', Listbox)
app.component('MegaMenu', MegaMenu)
app.component('Menu', Menu)
app.component('Menubar', Menubar)
app.component('Message', Message)
app.component('MultiSelect', MultiSelect)
app.component('OrderList', OrderList)
app.component('OrganizationChart', OrganizationChart)
app.component('OverlayPanel', OverlayPanel)
app.component('Paginator', Paginator)
app.component('Panel', Panel)
app.component('PanelMenu', PanelMenu)
app.component('Password', Password)
app.component('PickList', PickList)
app.component('ProgressBar', ProgressBar)
app.component('RadioButton', RadioButton)
app.component('Rating', Rating)
app.component('SelectButton', SelectButton)
app.component('ScrollPanel', ScrollPanel)
app.component('ScrollTop', ScrollTop)
app.component('Slider', Slider)
app.component('Sidebar', Sidebar)
app.component('Skeleton', Skeleton)
app.component('SplitButton', SplitButton)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Steps', Steps)
app.component('TabMenu', TabMenu)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Tag', Tag)
app.component('Textarea', Textarea)
app.component('TieredMenu', TieredMenu)
app.component('Timeline', Timeline)
app.component('Toast', Toast)
app.component('Toolbar', Toolbar)
app.component('ToggleButton', ToggleButton)
app.component('Tree', Tree)
app.component('TreeTable', TreeTable)
app.component('TriStateCheckbox', TriStateCheckbox)
app.component('VirtualScroller', VirtualScroller)

app.use(PrimeVue, { ripple: true, unstyled: true, pt: ocr4all });
// services
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)

app.use(VueQueryPlugin);
app.use(i18n);
app.use(createPinia());
app.use(ToastService);
app.use(router);
app.use(plugin, defaultConfig(formkitConfig));
app.use(autoAnimatePlugin)

app.mount("#app");
