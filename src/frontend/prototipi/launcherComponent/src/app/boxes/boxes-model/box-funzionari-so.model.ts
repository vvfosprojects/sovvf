export class BoxFunzionariSo {
    constructor(
        /**
         * E' il codice fiscale della persona, utile come chiave per eventuali approfondimenti sull'istanza
         */
        public codiceFiscale: string,
        /**
         * Qualifica della persona, visibile in interfaccia (per es. 'VCTI')
         */
        public qualifica: string,
        /**
         * Nominativo della persona, visibile in interfaccia (per es. 'Daniela Fares')
         */
        public descrizione: string,
        /**
         * Indica se la persona ha il ruolo di funzionario di Guardia (UDS)
         */
        public funzGuardia: boolean,
        /**
         * Indica se la persona ha il ruolo di 1° tecnico di guardia (UTS1)
         */
        public tecnicoGuardia1: boolean,
        /**
         * Indica se la persona ha il ruolo di 2° tecnico di guardia (UTS2)
         */
        public tecnicoGuardia2: boolean,
        /**
         * Indica se la persona ha il ruolo di Capo Turno
         */
        public capoTurno: boolean
    ) {
    }
}