import {Componente} from './componente.model';

export class Squadra {
    constructor(
        /**
         * Il nome della squadra
         */
        public nome: string,
        /**
         * E' l'istante in cui la squadra ha terminato il suo impegno sulla richiesta.
         * Se è null, la squadra è ancora impegnata sulla richiesta.
         */
        public istanteTermineImpegno: Date,
        /**
         * I componenti della squadra
         */
        public componenti: Componente[]
    ) {
    }
}
