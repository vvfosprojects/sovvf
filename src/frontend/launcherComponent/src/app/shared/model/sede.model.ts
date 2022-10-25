import { Coordinate } from './coordinate.model';

export class Sede {
    constructor(
        /**
         * Codice sede
         */
        public codice: string,
        /**
         * Descrizione della sede
         */
        public descrizione: string,
        /**
         * coordinate sede
         */
        public coordinate: Coordinate,
        /**
         * indirizzo sede
         */
        public indirizzo: string,
        /**
         * tipologia sede (Es: Comando, Distaccamento)
         */
        public tipo: string,
        /**
         * indica la regione della sede
         */
        public regione: string,
        /**
         * indica la provincia della sede
         */
        public provincia: string,
        /**
         * sigla della sede
         */
        public sigla?: string,
        /**
         * label (da decidere)
         */
        public label?: string,
        /**
         * icona della sede
         */
        public icona?: string,
        /**
         * coordinate sede string
         */
        public coordinateString?: string[]
    ) {
    }
}
