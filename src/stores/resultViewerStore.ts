import { defineStore } from "pinia";
interface IResultViewerStore {
  projectId?: string;
  sandboxId?: string;
}
export const useResultViewerStore = defineStore({
  id: "resultViewer",
  state: (): IResultViewerStore => ({
    projectId: undefined,
    sandboxId: undefined,
  }),
  actions: {},
});
