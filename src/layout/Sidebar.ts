import {
  AcademicCapIcon,
  CubeTransparentIcon,
  HomeIcon,
  QueueListIcon,
  ServerIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
} from "@heroicons/vue/24/outline";
import { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

interface navigationEntry {
  to: string;
  label: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
}

export const navigation: navigationEntry[] = [
  {
    to: "/",
    label: "nav.sidebar.links.dashboard",
    icon: HomeIcon,
  },
  {
    to: "/repository",
    label: "nav.sidebar.links.repository",
    icon: ServerIcon,
  },
  {
    to: "/project",
    label: "nav.sidebar.links.projects",
    icon: Squares2X2Icon,
  },
  {
    to: "/workflows",
    label: "nav.sidebar.links.workflows",
    icon: Square3Stack3DIcon,
  },
  {
    to: "/nodeflow",
    label: "nav.sidebar.links.nodeflow",
    icon: CubeTransparentIcon,
  },
  {
    to: "/queue",
    label: "nav.sidebar.links.queue",
    icon: QueueListIcon,
  },
  {
    to: "/training",
    label: "nav.sidebar.links.training",
    icon: AcademicCapIcon,
  },
];
