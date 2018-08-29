/**
 * Modella una tipologia di intervento
 */
export class Tipologia {
    constructor(
        /**
         * Codice tipologia
         */
        public codice: number,
        /**
         * Descrizione della tipologia
         */
        public descrizione: string,
        /**
         * Classe font-awesome
         */
        public icona: string
    ) {
    }
}
