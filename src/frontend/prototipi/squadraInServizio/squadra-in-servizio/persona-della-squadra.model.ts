export class PersonaDellaSquadra {
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
         * Indica se la persona ha il ruolo di capo partenza sul mezzo
         */
        public capoPartenza: boolean,

        /**
         * Indica se la persona ha il ruolo di autista sul mezzo
         */
        public autista: boolean) { }
}