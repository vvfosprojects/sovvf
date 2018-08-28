import { FunzionariSo } from "../box-funzionari/funzionari-so.model";
import { BoxInterventi } from "../box-interventi/box-interventi.model";

export class InfoAggregate {
    constructor(
        /* Array contenente le informazioni relative ai funzionari di servizio in Sala Operativa */
        public funzionariSo: FunzionariSo[],

        /* Array contenente le informazioni sugli interventi */
        public interventi: BoxInterventi[]
        
    ) { }
}


                
