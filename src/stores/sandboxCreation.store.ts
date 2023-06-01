import { defineStore } from "pinia";
interface ISandboxCreationStore {
  projectId?: string;
  sandboxId?: string;
  selectedImages?: number[];
}
export const useSandboxCreationStore = defineStore({
  id: "sandboxCreation",
  state: (): ISandboxCreationStore => ({
    projectId: undefined,
    sandboxId: undefined,
    selectedImages: undefined,
  }),
  actions: {},
});
