import { defineStore } from "pinia";
interface INodeFlowStore {
  graphId: string;
  graphLabel: string;
  sidebarDescriptions?: object;
}
export const useNodeFlowStore = defineStore({
  id: "nodeflow",
  state: (): INodeFlowStore => ({
    graphId: "",
    graphLabel: "",
    sidebarDescriptions: undefined,
  }),
  actions: {},
});
