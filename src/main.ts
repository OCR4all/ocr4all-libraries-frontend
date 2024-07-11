import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { plugin, defaultConfig } from "@formkit/vue";
import formkitConfig from "@/formkit.config";

import { createApp } from "vue";
import App from "./App.vue";

import "./assets/css/base.css";

import router from "./router";

import { createHead } from "@unhead/vue";
const head = createHead();

import { VueQueryPlugin } from "@tanstack/vue-query";
// PrimeVue imports
import Aura from "@primevue/themes/aura";

import AutoComplete from "primevue/autocomplete";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Badge from "primevue/badge";
import BlockUI from "primevue/blockui";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import CascadeSelect from "primevue/cascadeselect";
import Chart from "primevue/chart";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import ContextMenu from "primevue/contextmenu";
import DataTable from "primevue/datatable";
import DataView from "primevue/dataview";
import DynamicDialog from "primevue/dynamicdialog";
import DeferredContent from "primevue/deferredcontent";
import Dialog from "primevue/dialog";
import Dock from "primevue/dock";
import Divider from "primevue/divider";
import Editor from "primevue/editor";
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import Image from "primevue/image";
import Inplace from "primevue/inplace";
import InputIcon from "primevue/inputicon";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputOtp from "primevue/inputotp";
import InputText from "primevue/inputtext";
import Knob from "primevue/knob";
import Galleria from "primevue/galleria";
import Listbox from "primevue/listbox";
import MegaMenu from "primevue/megamenu";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import OrderList from "primevue/orderlist";
import OrganizationChart from "primevue/organizationchart";
import OverlayBadge from "primevue/overlaybadge";
import Popover from "primevue/popover";
import Paginator from "primevue/paginator";
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import PickList from "primevue/picklist";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Rating from "primevue/rating";
import RadioButton from "primevue/radiobutton";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import ScrollTop from "primevue/scrolltop";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import StepItem from "primevue/stepitem";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import Slider from "primevue/slider";
import Drawer from "primevue/drawer";
import Skeleton from "primevue/skeleton";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Tag from "primevue/tag";
import TieredMenu from "primevue/tieredmenu";
import Textarea from "primevue/textarea";
import Timeline from "primevue/timeline";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import ToggleSwitch from "primevue/toggleswitch";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import ToggleButton from "primevue/togglebutton";
import Tree from "primevue/tree";
import TreeTable from "primevue/treetable";
import VirtualScroller from "primevue/virtualscroller";

import "primeicons/primeicons.css";

import PrimeVue from "primevue/config";

// directives
import BadgeDirective from "primevue/badgedirective";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import Tooltip from "primevue/tooltip";
import FocusTrap from "primevue/focustrap";

// services
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { definePreset } from "@primevue/themes";

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

app.directive("badge", BadgeDirective);
app.directive("ripple", Ripple);
app.directive("tooltip", Tooltip);
app.directive("styleclass", StyleClass);
app.directive("focustrap", FocusTrap);

// components
app.component("Accordion", Accordion);
app.component("AccordionPanel", AccordionPanel);
app.component("AccordionHeader", AccordionHeader);
app.component("AccordionContent", AccordionContent);
app.component("AutoComplete", AutoComplete);
app.component("Avatar", Avatar);
app.component("AvatarGroup", AvatarGroup);
app.component("Badge", Badge);
app.component("BlockUI", BlockUI);
app.component("Breadcrumb", Breadcrumb);
app.component("Button", Button);
app.component("Card", Card);
app.component("Carousel", Carousel);
app.component("CascadeSelect", CascadeSelect);
app.component("Chart", Chart);
app.component("Checkbox", Checkbox);
app.component("Chip", Chip);
app.component("Chips", Chips);
app.component("ColorPicker", ColorPicker);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("ConfirmDialog", ConfirmDialog);
app.component("ConfirmPopup", ConfirmPopup);
app.component("ContextMenu", ContextMenu);
app.component("DataTable", DataTable);
app.component("DataView", DataView);
app.component("Dock", Dock);
app.component("DeferredContent", DeferredContent);
app.component("Dialog", Dialog);
app.component("DynamicDialog", DynamicDialog);
app.component("Divider", Divider);
app.component("Editor", Editor);
app.component("Fieldset", Fieldset);
app.component("FileUpload", FileUpload);
app.component("FloatLabel", FloatLabel);
app.component("IconField", IconField);
app.component("Image", Image);
app.component("Inplace", Inplace);
app.component("InputIcon", InputIcon);
app.component("InputMask", InputMask);
app.component("InputOtp", InputOtp);
app.component("InputNumber", InputNumber);
app.component("InputText", InputText);
app.component("Galleria", Galleria);
app.component("Knob", Knob);
app.component("Listbox", Listbox);
app.component("MegaMenu", MegaMenu);
app.component("Menu", Menu);
app.component("Menubar", Menubar);
app.component("Message", Message);
app.component("MultiSelect", MultiSelect);
app.component("OrderList", OrderList);
app.component("OrganizationChart", OrganizationChart);
app.component("OverlayBadge", OverlayBadge);
app.component("Popover", Popover);
app.component("Paginator", Paginator);
app.component("Panel", Panel);
app.component("PanelMenu", PanelMenu);
app.component("Password", Password);
app.component("PickList", PickList);
app.component("ProgressBar", ProgressBar);
app.component("ProgressSpinner", ProgressSpinner)
app.component("RadioButton", RadioButton);
app.component("Rating", Rating);
app.component("Select", Select);
app.component("SelectButton", SelectButton);
app.component("ScrollPanel", ScrollPanel);
app.component("ScrollTop", ScrollTop);
app.component("Slider", Slider);
app.component("Drawer", Drawer);
app.component("Skeleton", Skeleton);
app.component("SplitButton", SplitButton);
app.component("Splitter", Splitter);
app.component("SplitterPanel", SplitterPanel);
app.component("Stepper", Stepper);
app.component("StepList", StepList);
app.component("StepPanels", StepPanels);
app.component("StepItem", StepItem);
app.component("Step", Step);
app.component("StepPanel", StepPanel);
app.component("Tabs", Tabs);
app.component("TabList", TabList);
app.component("Tab", Tab);
app.component("TabPanels", TabPanels);
app.component("TabPanel", TabPanel);
app.component("Tag", Tag);
app.component("Textarea", Textarea);
app.component("TieredMenu", TieredMenu);
app.component("Timeline", Timeline);
app.component("Toast", Toast);
app.component("Toolbar", Toolbar);
app.component("ToggleButton", ToggleButton);
app.component("ToggleSwitch", ToggleSwitch);
app.component("Tree", Tree);
app.component("TreeTable", TreeTable);
app.component("VirtualScroller", VirtualScroller);

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{main.50}",
      100: "{main.100}",
      200: "{main.200}",
      300: "{main.300}",
      400: "{main.400}",
      500: "{main.500}",
      600: "{main.600}",
      700: "{main.700}",
      800: "{main.800}",
      900: "{main.900}",
      950: "{main.950}",
    },
    colorScheme: {
      light: {
        surface: {
          0: "#ffffff",
          50: "{bg.50}",
          100: "{bg.100}",
          200: "{bg.200}",
          300: "{bg.300}",
          400: "{bg.400}",
          500: "{bg.500}",
          600: "{bg.600}",
          700: "{bg.700}",
          800: "{bg.800}",
          900: "{bg.900}",
          950: "{bg.950}",
        },
      },
      dark: {
        surface: {
          0: "#ffffff",
          50: "{bg.50}",
          100: "{bg.100}",
          200: "{bg.200}",
          300: "{bg.300}",
          400: "{bg.400}",
          500: "{bg.500}",
          600: "{bg.600}",
          700: "{bg.700}",
          800: "{bg.800}",
          900: "{bg.900}",
          950: "{bg.950}",
        },
      },
    },
  },
});

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: CustomPreset,
    options: {
      prefix: "p",
      darkModeSelector: ".dark",
      cssLayer: false,
    },
  },
});
// services
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.use(VueQueryPlugin);
app.use(i18n);
app.use(createPinia());
app.use(head);
app.use(router);
app.use(plugin, defaultConfig(formkitConfig));
app.use(autoAnimatePlugin);

app.mount("#app");
