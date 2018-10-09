export class BoxMezzi {
    constructor(
        /* Chiamate non ancora presidiate */
        public inSede: number,
        /* Interventi con mezzi non ancora arrivati sul posto */
        public inViaggio: number,
        /* Interventi con mezzi sul posto */
        public sulPosto: number,
        /* Interventi con mezzi in rientro  */
        public inRientro: number,
        /* Mezzi istituzionali */
        public istituto: number
    ) {
    }

    getTotal() {
        return Object.values(this).reduce((a, b) => a + b, 0);
    }
}