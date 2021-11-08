import {BoxFunzionariSo} from './box-funzionari-so.model';

export class BoxPersonale {
    constructor(
        /**
         * il totale del personale in servizio
         */
        public personaleTotale: {
            previous: number,
            current: number,
            next: number
        },
        /**
         * i funzionari presenti
         */
        public funzionari: {
            previous: BoxFunzionariSo[],
            current: BoxFunzionariSo[],
            next: BoxFunzionariSo[]
        },
        /**
         * numero squadre in servizio
         */
        public squadreServizio: {
            previous: number,
            current: number,
            next: number
        },
        /**
         * numero squadre assegnate
         */
        public squadreAssegnate: number
    ) {
    }
}
