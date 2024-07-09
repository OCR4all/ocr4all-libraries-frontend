import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth.store";
import { useConfigStore } from "@/stores/config.store";
import { useUiStore } from "@/stores/ui.store";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/pages/DashboardPage.vue"),
  },
  {
    path: "/queue",
    name: "Queue",
    component: () => import("@/pages/QueuePage.vue"),
  },
  {
    path: "/repository",
    name: "Repository",
    redirect: "/repository/overview",
    component: () => import("@/pages/RepositoryPage.vue"),
    children: [
      {
        path: "overview",
        name: "repository-overview",
        component: () =>
          import("@/components/Repository/RepositoryOverview.vue"),
      },
      {
        path: "container",
        name: "Container",
        component: () =>
          import("@/components/Repository/Images/Container/ContainerView.vue"),
      },
      {
        path: "dataset",
        name: "Dataset",
        component: () =>
          import("@/components/Repository/Datasets/CollectionSet.vue"),
      },
    ],
  },
  {
    path: "/project",
    name: "Project",
    redirect: "/project/overview",
    component: () => import("@/pages/ProjectPage.vue"),
    children: [
      {
        path: "overview",
        name: "Overview",
        component: () => import("@/components/Project/ProjectsOverview.vue"),
      },
      {
        path: "new",
        name: "New Project",
        component: () => import("@/components/Project/NewProject.vue"),
      },
      {
        path: ":project",
        name: "Project",
        component: () => import("@/components/Project/ProjectContainer.vue"),
        children: [
          {
            path: "view",
            name: "View Project",
            component: () => import("@/components/Project/ProjectView.vue"),
          },
          {
            path: "new-result",
            name: "New Sandbox",
            component: () =>
              import("@/components/Project/Project/Sandbox/NewSandbox.vue"),
          },
          {
            path: "result/:sandbox",
            name: "Sandbox",
            component: () =>
              import("@/components/Project/Project/Sandbox/ResultViewer.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/workflows",
    name: "workflow_page",
    component: () =>
      import("@/pages/WorkflowsPage.vue"),
  },
  {
    path: "/nodeflow",
    name: "NodeFlow",
    component: () => import("@/pages/NodeFlowPage.vue"),
  },
  {
    path: "/training",
    name: "training",
    redirect: "/training/overview",
    component: () => import("@/pages/TrainingPage.vue"),
    children: [
      {
        path: "overview",
        name: "training_overview",
        component: () => import("@/components/Training/TrainingOverview.vue"),
      },
      {
        path: "calamari",
        name: "training_calamari",
        component: () => import("@/components/Training/Calamari/CalamariView.vue"),
      },
    ]
  },
  {
    path: "/evaluation",
    name: "evaluation",
    component: () => import("@/pages/EvaluationPage.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/LoginPage.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    redirect: "/admin/overview",
    component: () => import("@/pages/AdminPage.vue"),
    children: [
      {
        path: "overview",
        name: "Admin Overview",
        component: () => import("@/components/Admin/Overview.vue"),
      },
      {
        path: "users",
        name: "Users",
        component: () =>
          import("@/components/Admin/UserManagement/UserManagementView.vue"),
      },
      {
        path: "groups",
        name: "Groups",
        component: () =>
          import("@/components/Admin/GroupManagement/GroupManagement.vue"),
      },
      {
        path: "providers",
        name: "Providers",
        component: () =>
          import(
            "@/components/Admin/InstanceAdministration/ProviderManagement.vue"
          ),
      },
      {
        path: "ocrdapi",
        name: "OCRD API Viewer",
        component: () => import("@/components/Admin/OCRAPIViewer.vue"),
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/pages/SettingsPage.vue"),
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/pages/NotFoundPage.vue"),
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
