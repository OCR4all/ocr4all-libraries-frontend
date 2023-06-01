import { defineStore } from "pinia";
interface INodeFlowStore {
  graphId: string;
  sidebarDescriptions?: object;
}
export const useNodeFlowStore = defineStore({
  id: "nodeflow",
  state: (): INodeFlowStore => ({
    graphId: "",
    sidebarDescriptions: undefined,
  }),
  actions: {},
});
