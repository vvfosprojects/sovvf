import { Mezzo } from "../../shared/model/mezzo.model";

export class MezzoComposizione {
    constructor(
        public id: string,
        public mezzo: Mezzo,
        public km: string,
        public tempoPercorrenza: string
    ) {
    }
}
