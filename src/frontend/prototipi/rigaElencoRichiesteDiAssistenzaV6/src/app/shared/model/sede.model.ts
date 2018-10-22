import {Localita} from './localita.model';

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
        public localita: Localita,
        /**
         * tipologia sede (Es: Comando, Distaccamento)
         */
        public tipo: string,
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
