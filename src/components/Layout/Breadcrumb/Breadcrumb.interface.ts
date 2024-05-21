export interface IBreadCrumbEntry {
  label: string;
  to?: string;
}

export interface IBreadcrumb {
  home: IBreadCrumbEntry;
  path?: IBreadCrumbEntry[];
  current: IBreadCrumbEntry;
}
