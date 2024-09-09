import {ITracking} from "@/types/auth/tracking.types";

export interface IModel {
    id: string,
    description: string | null,
    keywords: string[],
    name: string,
    right: string | null,
    tracking: ITracking
}