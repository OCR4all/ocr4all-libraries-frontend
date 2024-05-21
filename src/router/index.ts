import { createRouter, createWebHistory } from "vue-router";

const DashboardPage = () => import("@/pages/DashboardPage.vue");
const LoginPage = () => import("@/pages/LoginPage.vue");
const NotFoundPage = () => import("@/pages/NotFoundPage.vue");
const QueuePage = () => import("@/pages/QueuePage.vue");
const ProjectPage = () => import("@/pages/ProjectPage.vue");
const ProjectOverview = () =>
  import("@/components/Project/ProjectsOverview.vue");
const New = () => import("@/components/Project/NewProject.vue");
const Sandbox = () =>
  import("@/components/Project/Project/Sandbox/NewSandbox.vue");
const ProjectView = () => import("@/components/Project/ProjectView.vue");

const ProjectContainer = () =>
  import("@/components/Project/ProjectContainer.vue");
const ResultViewer = () =>
  import("@/components/Project/Project/Sandbox/ResultViewer.vue");
const NodeFlowPage = () => import("@/pages/NodeFlowPage.vue");
const WorkflowsPage = () => import("@/pages/WorkflowsPage.vue");

const RepositoryOverview = () =>
  import("@/components/Repository/RepositoryOverview.vue");
const RepositoryUpload = () =>
  import("@/components/Repository/RepositoryUpload.vue");
const RepositoryPage = () => import("@/pages/RepositoryPage.vue");

const ContainerView = () => import("@/components/Repository/ContainerView.vue");
const AdminPage = () => import("@/pages/AdminPage.vue");

const TrainingPage = () => import("@/pages/TrainingPage.vue");

import { useAuthStore } from "@/stores/auth.store";
import { useConfigStore } from "@/stores/config.store";
import { useUiStore } from "@/stores/ui.store";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/queue",
    name: "Queue",
    component: QueuePage,
  },
  {
    path: "/repository",
    name: "Repository",
    redirect: "/repository/overview",
    component: RepositoryPage,
    children: [
      {
        path: "overview",
        name: "Repository Overview",
        component: RepositoryOverview,
      },
      {
        path: "upload",
        name: "Upload",
        component: RepositoryUpload,
      },
      {
        path: "container",
        name: "Container",
        component: ContainerView,
      },
    ],
  },
  {
    path: "/project",
    name: "Project",
    redirect: "/project/overview",
    component: ProjectPage,
    children: [
      {
        path: "overview",
        name: "Overview",
        component: ProjectOverview,
      },
      {
        path: "new",
        name: "New Project",
        component: New,
      },
      {
        path: ":project",
        name: "Project",
        component: ProjectContainer,
        children: [
          {
            path: "view",
            name: "View Project",
            component: ProjectView,
          },
          {
            path: "new-result",
            name: "New Sandbox",
            component: Sandbox,
          },
          {
            path: "result/:sandbox",
            name: "Sandbox",
            component: ResultViewer,
          },
        ],
      },
    ],
  },
  {
    path: "/workflows",
    name: "Workflows",
    component: WorkflowsPage,
  },
  {
    path: "/nodeflow",
    name: "NodeFlow",
    component: NodeFlowPage,
  },
  {
    path: "/training",
    name: "Training",
    component: TrainingPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFoundPage,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const ui = useUiStore();
  ui.flush();
  const config = useConfigStore();

  if (config.mode !== "Desktop") {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ["/login"];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();
    if (authRequired && (auth.user === undefined || auth.token === undefined)) {
      auth.returnUrl = to.fullPath;
      return "/login";
    }
  }
});

export default router;
