import { RouteLocationRaw } from "vue-router";

export interface IBreadCrumbEntry {
  label: string;
  to?: RouteLocationRaw;
}
