export class FunzionariSo {
    constructor(
        /**
         * E' il codice fiscale della persona, utile come chiave per eventuali approfondimenti sull'istanza
         */
        public codiceFiscale: string,
        
        /**
         * Descrizione della persona, visibile in interfaccia (per es. 'VCTI Daniela Fares')
         */
        public descrizione: string,

        /**
         * Tooltip che appare muovendosi con il mouse sulla persona (per es. il codice fiscale per risolvere le omonimie)
         */
        public tooltip: string,

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
       
        ) { }
}