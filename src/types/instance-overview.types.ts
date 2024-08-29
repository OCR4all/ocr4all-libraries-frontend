export interface IAdministrationOverview {
  application: IApplication;
  exchange: IExchange;
  opt: IOpt;
  temporary: ITemporary;
  workspace: IWorkspace;
  system: ISystem;
  "service-provider-properties": IServiceProviderProperties[];
}

export interface IApplication {
  "active-profiles": string[];
  "administrator-group": string;
  charset: string;
  "coordinator-group": string;
  "date-format-pattern": string;
  locale: string;
  "monitor-interval": number;
  name: string;
  start: string;
  "thread-pool-size": { size: number }[];
  "view-languages": string[];
}

export interface IExchange {
  folder: string;
}

export interface IOpt {
  folder: string;
}

export interface IServiceProviderProperties {
  collection: string;
  key: string;
  value: string;
}

export interface ICommand {
  type: string;
  command: string;
  available: boolean;
}

export interface ISystem {
  commands: ICommand[];
  "operating-system": string;
  "system-group-id": number;
  "system-user-id": number;
}

export interface IThreadPool {
  name: string;
  size: number;
}

export interface IWorkspace {
  folder: string;
  version: string;
  "default-version": string;
  "projects-folder": string;
  "thread-pools": IThreadPool[];
  "user-file": string;
  "group-file": string;
  "password-file": string;
}

export interface ITemporary {
  folder: string;
  prefix: string;
}
