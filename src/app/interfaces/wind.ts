import { Measure } from "./measure";


export interface Wind extends Measure {
    windStrength?: number;
    windAngle?: number;
    gustStrength?: number;
    gustAngle?: number;
}
