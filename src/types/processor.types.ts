interface IPremise {
  state: string;
  message: string | null;
}

interface IItem {
  type: string;
  description: string | null;
  value: string;
  selected: boolean;
  disabled: boolean;
}

interface IEntry {
  type: string;
  label: string;
  argument: string;
  value: string | null;
  description: string;
  placeholder: string | null;
  disabled: boolean;
}

interface ISelectEntry extends IEntry {
  items: IItem[];
  "multiple-options": boolean;
}

interface IDecimalEntry extends IEntry {
  step: number | null;
  minimum: number | null;
  maximum: number | null;
  unit: string | null;
}

export interface IProcessor {
  type: string;
  id: string;
  provider: string;
  language: string;
  name: string;
  version: number;
  description: string;
  categories: string[];
  steps: string[];
  icon: string | null;
  premise: IPremise;
  entries: IEntry[];
  "type-label": string
}
