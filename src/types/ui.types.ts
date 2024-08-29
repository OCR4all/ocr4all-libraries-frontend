export interface IContextMenuItem {
  label: string
  icon?: string
  command?: unknown
}

export interface IMenuItems {
  label: string,
  items: IMenuItem[]
}

export interface IMenuItem {
  label: string
  icon?: string
  command?: unknown
}
