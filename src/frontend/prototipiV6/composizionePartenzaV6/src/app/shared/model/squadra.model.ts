import { Componente } from './componente.model';
import { Sede } from './sede.model';

export class Squadra {
    constructor(
        /**
         * Il nome della squadra
         */
        public nome: string,
        /**
         * Stato del squadra (InSede, InViaggio, SulPosto,
         * InRientro, Istituto).
         */
        public stato: string,
        /**
         * I componenti della squadra
         */
        public componenti: Componente[],
        /**
        * Distaccamento di appartenza
        */
        public distaccamento: Sede,
        /**
         * E' l'istante in cui la squadra ha terminato il suo impegno sulla richiesta.
         * Se è null, la squadra è ancora impegnata sulla richiesta.
         */
        public istanteTermineImpegno?: Date
    ) {
    }
}
