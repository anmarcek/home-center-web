import { Air } from "./air";
import { Wind } from "./wind";

export interface Weather {
    outdoorAir?: Air;
    indoorAir?: Air;
    wind?: Wind;
}