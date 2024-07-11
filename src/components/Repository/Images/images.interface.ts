export interface ITracking {
  created: string,
  updated: string,
  user: string
}

export interface IContainer {
  description: string | null,
  id: string,
  keywords: string[] | null,
  name: string,
  right: string | null,
  tracking: ITracking[]
}
