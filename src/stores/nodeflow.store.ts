import { defineStore } from "pinia";
import { IWorkflow } from "@/types/workflow.types";

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
