export class BoxMezzi {
    constructor(
        /**
         * Chiamate non ancora presidiate
         */
        public inSede: number,
        /**
         * Interventi con mezzi non ancora arrivati sul posto
         */
        public inViaggio: number,
        /**
         * Interventi con mezzi sul posto
         */
        public sulPosto: number,
        /**
         * Interventi con mezzi in rientro
         */
        public inRientro: number,
        /**
         * Mezzi istituzionali
         */
        public istituto: number,
        /**
         * Mezzi inServizio (il totale dei mezzi tranne quelli istituto
         */
        public inServizio: number
    ) {
    }

}
