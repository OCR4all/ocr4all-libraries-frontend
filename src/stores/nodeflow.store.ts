import { defineStore } from "pinia";

interface IWorkflow {
  date: string,
  user: string,
  id: string,
  updated: string,
  label: string,
  description: string,
  "update-user": string
}

interface INodeFlowStore {
  workflow: IWorkflow | null,
  sidebarDescriptions?: object;
}
export const useNodeFlowStore = defineStore({
  id: "nodeflow",
  state: (): INodeFlowStore => ({
    workflow: null,
    sidebarDescriptions: undefined,
  }),
  actions: {},
});
