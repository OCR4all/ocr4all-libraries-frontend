export interface ITracking {
  created: string,
  updated: string,
  user: string
}

export interface IContainer {
  description: string,
  id: string,
  keywords: string[],
  name: string,
  right: string | null,
  tracking: ITracking
}
