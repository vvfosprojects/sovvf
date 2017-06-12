export class PermessoUtente {
    constructor(
        /**
         * E' il codice fiscale della persona, utile come chiave per eventuali approfondimenti sull'istanza
         */
        public codiceFiscale: string,

        /**
         * Ruolo (es: operatore, amministratore)
         */
        public ruolo: string,

        /**
         * Tipo del permesso (es. insert, delete)
         */
        public tipoPermesso: string,
        /**
         * Codice Unità Operativa
         */
        public codiceunitaoperativa: string,
        /**
         * Data iniziale per cui vale un determitao permesso
         */
        public dataInizioPermesso: Date,
        /**
         * Data Finale per cui vale un determitao permesso
         */
        public dataFinePermesso: Date,
        /**
         * Indica se un determinato permesso è ricorsivo o meno
         */
        public ricorsivo: boolean) { }
}