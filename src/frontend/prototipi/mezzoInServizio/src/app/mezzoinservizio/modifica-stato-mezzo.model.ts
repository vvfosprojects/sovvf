export class ModificaStatoMezzo {
    constructor(
        /**
         * E' il codice identificativo del mezzo
         */
        public codice: string,
        /**
         * E' il codice stato del mezzo da aggiornare
         */
        public codiceStato: string,
        /**
         * E' il codice stato del mezzo precedente
         */
        public codiceStatoPrec: string

        ) {}
}