import {
  AcademicCapIcon,
  CubeTransparentIcon,
  HomeIcon,
  QueueListIcon,
  ServerIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  UsersIcon,
  UserGroupIcon,
  ViewfinderCircleIcon,
  CpuChipIcon
} from "@heroicons/vue/24/outline";
import { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

interface navigationEntry {
  to: string;
  label: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
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
  },
  {
    to: "/project",
    label: "nav.sidebar.links.main.projects",
    icon: Squares2X2Icon,
  },
  {
    to: "/workflows",
    label: "nav.sidebar.links.main.workflows",
    icon: Square3Stack3DIcon,
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
];

export const adminNavigation: navigationEntry[] = [
  {
    to: "/admin/dashboard",
    label: "nav.sidebar.links.admin.dashboard",
    icon: HomeIcon,
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
