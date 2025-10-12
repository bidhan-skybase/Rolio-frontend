import {LucideIcon} from "lucide-react";
import {JobInterface} from "@/types/jobs";

export interface ColumnInterface {
    id:string,
    title:string,
    tasks:JobInterface[],
    icon: LucideIcon
}
