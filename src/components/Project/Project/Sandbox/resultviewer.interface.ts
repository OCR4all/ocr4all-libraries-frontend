interface IInstance {
    id: number,
    name: string
}

interface IEntry {
    argument: string
}

interface IBoolean extends IEntry {
    value: boolean
}

interface IDecimal extends IEntry {
    value: number
}

interface IInteger extends IEntry {
    value: number
}

interface IString extends IEntry {
    value: string
}

interface IImage extends IEntry {
    value: unknown
}

interface IWeight extends IEntry {
    value: unknown
}

interface ISelect extends IEntry {
    value: Array<string>
}

interface IServiceProvider {
    id: string,
    booleans: IBoolean[],
    decimals: IDecimal[],
    integers: IInteger[],
    strings: IString[],
    images: IImage[],
    weights: IWeight[],
    selects: ISelect[]
}

interface IConfiguration {
    date: string,
    user: string,
    type: string,
    updated: string,
    label: string,
    "type-label": string,
    description: string,
    instance: IInstance,
    lock: null | string,
    "service-provider": IServiceProvider
}

interface IProcess {
    date: string,
    user: string,
    state: string,
    updated: string,
    progress: number,
    note: string | null,
    "standard-output": string | null,
    "standard-error": string | null
}

export interface ISnapshot {
    projectId: string,
    sandboxId: string,
    track: number[],
    configuration: IConfiguration,
    process: IProcess,
    consistent: boolean,
}

export interface INode {
    snapshot: ISnapshot,
    children: INode[],
}

export interface IEnrichedNode extends INode {
    key: number[],
    label: string,
    type: string,
    styleClass: string
}
