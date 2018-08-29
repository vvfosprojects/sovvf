/**
 * Modella una competenza
 */
export class Competenza {
    constructor(
        /**
         * Codice competenza
         */
        public codice: number,
        /**
         * Descrizione della competenza
         */
        public descrizione: string,
        /**
         * coordinate competenza
         */
        public coordinate: number[]
    ) {
    }
}
