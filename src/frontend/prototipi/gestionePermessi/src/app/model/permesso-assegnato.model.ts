/**
 * Questa classe viene ricevuta dal backend per popolare la lista dei permessi attivi
 */
export class PermessoAssegnato {
    constructor(
        /**
         * E' l'id del permesso
         */
        public id: string,

        /**
         * E' la descrizione dell'utente coinvolto nel permesso
         */
        public descrizioneUtente: string,

        /**
         * E' il testo del tooltip che appare andando col mouse sulla descrizione
         */
        public tooltipUtente: string,

        /**
         * E' la descrizione del permesso
         */
        public descrizionePermesso: string,

        /**
         * E' la descrizione dell'unità operativa sulla quale agisce il permesso
         */
        public descrizioneUnitaOperativa: string,

        /**
         * Indica se il permesso è ricorsivo o meno
         */
        public ricorsivo: boolean,

        /**
         * Data iniziale per cui vale il permesso. Può essere null per indicare validità indefinita.
         */
        public dataInizioPermesso: Date,

        /**
         * Data Finale per cui vale il permesso. Può essere null per indicare validità indefinita.
         */
        public dataFinePermesso: Date) { }
}