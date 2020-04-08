export class AttivitaUtente {
    constructor(
        /**
         * id dell'utente
         */
        public idUtente: string,
        /**
         * nominativo dell'utente
         */
        public nominativo: string,
        /**
         * data dell'inizio attività
         */
        public dataInizioAttivita: Date
    ) {

    }

}
