export interface IWorkflow {
  date: string;
  user: string;
  id: string;
  updated: string;
  label: string;
  description: string;
  "update-user": string;
}

export interface IWorkflowMetadata {
  label: string;
  description: string;
  id: string;
  date: string;
}
