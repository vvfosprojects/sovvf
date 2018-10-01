import { Coordinate } from './coordinate.model';

export class Sede {
    constructor(
        /**
         * Codice sede
         */
        public codice: number,
        /**
         * Descrizione della sede
         */
        public descrizione: string,
        /**
         * coordinate sede
         */
        public coordinate: Coordinate,
        /**
         * tipologia sede (Es: Comando, Distaccamento)
         */
        public tipologia: string,
        /**
         * label (da decidere)
         */
        public label?: string,
        /**
         * icona della sede
         */
        public icona?: string
    ) {
    }
}
