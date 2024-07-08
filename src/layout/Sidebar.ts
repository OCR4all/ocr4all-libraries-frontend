import {
  AcademicCapIcon,
  CubeTransparentIcon,
  HomeIcon,
  QueueListIcon,
  ServerIcon,
  Squares2X2Icon,
  UsersIcon,
  UserGroupIcon,
  ViewfinderCircleIcon,
  InformationCircleIcon,
  CpuChipIcon,
} from "@heroicons/vue/24/outline";
import IconCompare from '~icons/carbon/compare'
import { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

interface navigationEntry {
  to: string;
  label: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
  children?: navigationEntry[]
}

export const mainNavigation: navigationEntry[] = [
  {
    to: "/",
    label: "nav.sidebar.links.main.dashboard",
    icon: HomeIcon,
  },
  {
    to: "/repository",
    label: "nav.sidebar.links.main.repository",
    icon: ServerIcon,
    children: [
      {
        to: "/repository/overview?section=Images",
        label: "Images",
        icon: ServerIcon
      },
      {
        to: "/repository?section=Datasets",
        label: "Datasets",
        icon: ServerIcon
      },
      {
        to: "/repository?section=Models",
        label: "Models",
        icon: ServerIcon
      },
      {
        to: "/repository?section=Workflows",
        label: "Workflows",
        icon: ServerIcon
      }
    ]
  },
  {
    to: "/project",
    label: "nav.sidebar.links.main.projects",
    icon: Squares2X2Icon,
  },
  {
    to: "/nodeflow",
    label: "nav.sidebar.links.main.nodeflow",
    icon: CubeTransparentIcon,
  },
  {
    to: "/queue",
    label: "nav.sidebar.links.main.queue",
    icon: QueueListIcon,
  },
  {
    to: "/training",
    label: "nav.sidebar.links.main.training",
    icon: AcademicCapIcon,
  },
  {
    to: "/evaluation",
    label: "Evaluation",
    icon: IconCompare,
  }
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
