export interface ITrack {
  created: string;
  updated: string;
  user: string;
}

export interface ISet {
  date: string;
  id: string;
  files: string[];
  keywords: string[];
  name: string;
  user: string;
}

export interface ICollectionSet {
  description: string;
  id: string;
  keywords: string[];
  name: string;
  right: string;
}
