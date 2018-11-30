import { Squadra } from "../../shared/model/squadra.model";
import { MezzoComposizione } from "./mezzo-composizione.model";

export class BoxPartenza {
    constructor(
        public id: number,
        public mezzoComposizione?: MezzoComposizione,
        public squadra?: Squadra,
    ) {
    }
}
