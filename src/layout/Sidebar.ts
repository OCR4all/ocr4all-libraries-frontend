import {
  UsersIcon,
  UserGroupIcon,
  ViewfinderCircleIcon,
  InformationCircleIcon,
  CpuChipIcon,
} from "@heroicons/vue/24/outline";

import IconDashboard from "~icons/heroicons/home";
import IconRepository from "~icons/material-symbols/home-storage-outline";
import IconProject from "~icons/heroicons/squares-2x2";
import IconNodeflow from "~icons/hugeicons/flow-square";
import IconQueue from "~icons/heroicons/queue-list";
import IconTraining from "~icons/carbon/machine-learning-model";
import IconEvaluation from "~icons/carbon/compare";

import { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

interface navigationEntry {
  to: string;
  label: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
  children?: navigationEntry[];
}

export const mainNavigation: navigationEntry[] = [
  {
    to: "/",
    label: "nav.sidebar.links.main.dashboard",
    icon: IconDashboard,
  },
  {
    to: "/repository",
    label: "nav.sidebar.links.main.repository",
    icon: IconRepository,
    children: [
      {
        to: "/repository/overview?section=Images",
        label: "Images",
        icon: IconRepository,
      },
      {
        to: "/repository?section=Datasets",
        label: "Datasets",
        icon: IconRepository,
      },
      {
        to: "/repository?section=Models",
        label: "Models",
        icon: IconRepository,
      },
      {
        to: "/repository?section=Workflows",
        label: "Workflows",
        icon: IconRepository,
      },
    ],
  },
  {
    to: "/project",
    label: "nav.sidebar.links.main.projects",
    icon: IconProject,
  },
  {
    to: "/nodeflow",
    label: "nav.sidebar.links.main.nodeflow",
    icon: IconNodeflow,
  },
  {
    to: "/queue",
    label: "nav.sidebar.links.main.queue",
    icon: IconQueue,
  },
  {
    to: "/training",
    label: "nav.sidebar.links.main.training",
    icon: IconTraining,
  },
  {
    to: "/evaluation",
    label: "Evaluation",
    icon: IconEvaluation,
  },
];

export const adminNavigation: navigationEntry[] = [
  {
    to: "/admin/overview",
    label: "nav.sidebar.links.admin.overview",
    icon: InformationCircleIcon,
  },
  {
    to: "/admin/users",
    label: "nav.sidebar.links.admin.users",
    icon: UsersIcon,
  },
  {
    to: "/admin/groups",
    label: "nav.sidebar.links.admin.groups",
    icon: UserGroupIcon,
  },
  {
    to: "/admin/providers",
    label: "nav.sidebar.links.admin.providers",
    icon: CpuChipIcon,
  },
  {
    to: "/admin/ocrdapi",
    label: "nav.sidebar.links.admin.ocrdapi",
    icon: ViewfinderCircleIcon,
  },
];
