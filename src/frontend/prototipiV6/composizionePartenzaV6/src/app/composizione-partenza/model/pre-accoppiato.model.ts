import { Squadra } from "src/app/shared/model/squadra.model";
import { Mezzo } from "src/app/shared/model/mezzo.model";

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
