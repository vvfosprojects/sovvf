import {BoxFunzionariSo} from './box-funzionari-so.model';

export class BoxPersonale {
    constructor(
        /**
         * il totale del personale in servizio
         */
        public personaleTotale: number,
        /**
         * i funzionari presenti
         */
        public funzionari: BoxFunzionariSo[],
        /**
         * numero squadre in servizio
         */
        public squadreServizio: number,
        /**
         * numero squadre assegnate
         */
        public squadreAssegnate: number
    ) {
    }
}
