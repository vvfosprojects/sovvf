export class InfoMezzo {
    constructor(
        /**
         * E' il tipo del mezzo (genere)
         */
        public genereMezzo: string,

        /**
         * E' il totale dei mezzi in Sede
         */
        public mezziInSede: number,

        /**
         * E' il totale dei mezzi in Viaggio
         */
        public mezziInViaggio: number,

        /**
         * E' il totale dei mezzi Sul Posto
         */
        public mezziSulPosto: number,

        /**
         * E' il totale dei mezzi In Rientro
         */
        public mezziInRientro: number
       
        ) { }
}