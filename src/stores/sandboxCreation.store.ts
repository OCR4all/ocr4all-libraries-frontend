import { defineStore } from "pinia";
interface ISandboxCreationStore {
  projectId?: string;
  sandboxId?: string;
  selectedImages?: string[];
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
