import {Coordinate} from './coordinate.model';

export class Localita {
    constructor(
        /* Latitidine e longitudine [latitudine,longitudine] */
        public coordinate: Coordinate,
        /* Indirizzo in formato stringa */
        public indirizzo?: string,
        /**
         * note sulla località della richiesta (per es. "accanto a ingresso
         * carico/scarico del supermercato Spendibene")
         */
        public note?: string
    ) {
    }
}
