import { Measure } from "./measure";

export interface Air extends Measure {
    temperature?: number;
    humidity?: number;
    co2?: number;
    pressure?: number;
    noise?: number;
}
