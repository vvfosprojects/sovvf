import { Squadra } from "../../shared/model/squadra.model";
import { Mezzo } from "../../shared/model/mezzo.model";

export class PreAccoppiato {
    constructor(
        public id: string,
        public mezzo: Mezzo,
        public squadra: Squadra,
        public distaccamento: string,
        public km: number,
        public tempoPercorrenza: string
    ) {
    }
}
