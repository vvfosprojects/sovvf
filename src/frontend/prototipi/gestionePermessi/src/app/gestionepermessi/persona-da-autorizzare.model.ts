export class PersonaDaAutorizzare {
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

        ) { }
}