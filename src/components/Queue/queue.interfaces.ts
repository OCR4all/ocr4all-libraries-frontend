export interface IProcess {
  "project-id": string,
  "sandbox-id": string,
  track: number[],
  type: string
}

export interface IJournalStep {
  completed: boolean,
  index: number,
  note: string | null,
  progress: number,
  "service-provider-id": string,
  "snapshot-track": number[],
  "standard-error": string | null,
  "standard-output": string | null
}

export interface IJournal {
  index: number,
  progress: number,
  size: number,
  steps: IJournalStep[]
}

export interface IJob {
  created: string,
  description: string,
  end: string,
  execute: boolean,
  id: number,
  journal: IJournal,
  process: IProcess,
  special: boolean,
  start: string,
  state: string
}

export interface IQueue {
  done: IJob[],
  running: IJob[],
  scheduled: IJob[]
}
