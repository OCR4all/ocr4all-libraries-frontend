import { defineStore } from "pinia";
interface IProjectCreationStore {
  projectId?: string;
}
export const useProjectCreationStore = defineStore({
  id: "projectCreation",
  state: (): IProjectCreationStore => ({
    projectId: undefined,
  }),
  actions: {},
});
