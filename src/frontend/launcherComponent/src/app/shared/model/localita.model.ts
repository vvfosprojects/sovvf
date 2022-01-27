import { Coordinate } from './coordinate.model';

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
        public note?: string,
        /**
         * piano del condominio
         */
        public piano?: string,
        /**
         * palazzo
         */
        public palazzo?: string,
        /**
         * scala del condominio / palazzo
         */
        public scala?: string,
        /**
         * interno del condominio / palazzo
         */
        public interno?: string,
        /**
         * contatto del condominio / palazzo
         */
        public contatto?: string,
        /**
         * provincia
         */
        public provincia?: string,
        /**
         * cap
         */
        public cap?: string,
        /**
         * regione
         */
        public regione?: string,
        /**
         * civico
         */
        public civico?: string,
        /**
         * Latitidine [0] e Longitudine [1]
         */
        public coordinateString?: string[]
    ) {
    }
}
