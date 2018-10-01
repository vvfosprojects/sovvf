import { Coordinate } from './coordinate.model';

export class Localita {
    constructor(
        /**
        * note sulla località della richiesta (per es. "accanto a ingresso
        * carico/scarico del supermercato Spendibene")
        */
        public note: string,
        /* Indirizzo in formato stringa */
        public indirizzo: string,
        /* Latitidine e longitudine [latitudine,longitudine] */
        public coordinate: Coordinate
    ) {
    }
}
