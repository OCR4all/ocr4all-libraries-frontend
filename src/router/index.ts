import { createRouter, createWebHistory } from "vue-router";

const DashboardPage = () => import("@/pages/DashboardPage.vue");
const LoginPage = () => import("@/pages/LoginPage.vue");
const NotFoundPage = () => import("@/pages/NotFoundPage.vue");
const QueuePage = () => import("@/pages/QueuePage.vue");
const ProjectPage = () => import("@/pages/ProjectPage.vue");
const Overview = () => import("@/components/Project/ProjectsOverview.vue");
const New = () => import("@/components/Project/NewProject.vue");
const Sandbox = () =>
  import("@/components/Project/Project/Sandbox/SandboxView.vue");
const Project = () => import("@/components/Project/ProjectView.vue");
const ResultViewer = () =>
  import("@/components/Project/Project/Sandbox/ResultViewer.vue");
const NodeFlowPage = () => import("@/pages/NodeFlowPage.vue");
const WorkflowsPage = () => import("@/pages/WorkflowsPage.vue");
const SandboxPage = () => import("@/pages/SandboxPage.vue");

import { useAuthStore } from "@/stores/auth.store";
import { useConfigStore } from "@/stores/config.store";

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
    path: "/project",
    name: "Project",
    redirect: "/project/overview",
    component: ProjectPage,
    children: [
      {
        path: "overview",
        name: "Overview",
        component: Overview,
      },
      {
        path: "new",
        name: "New Project",
        component: New,
      },
      {
        path: "sandbox",
        name: "New Sandbox",
        component: Sandbox,
      },
      {
        path: "results",
        name: "Result",
        component: ResultViewer,
      },
      {
        path: ":id",
        name: "Project Page",
        component: Project,
      },
    ],
  },
  {
    path: "/project/:projectid/:sandboxid",
    name: "Sandbox",
    component: SandboxPage,
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
    path: "/login",
    name: "Login",
    component: LoginPage,
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
