export class BoxInterventi {
    constructor(
        /* Totale interventi aperti */
        public interventiAperti: number,
        /* Chiamate non ancora presidiate */
        public chiamate: number,
        /* Interventi con mezzi non ancora arrivati sul posto */
        public inViaggio: number,
        /* Interventi con mezzi sul posto */
        public sulPosto: number,
        /* Interventi con mezzi in rientro  */
        public inRientro: number,
        /* Interventi con mezzi in attesa  */
        public inAttesa: number
        ) { }
}
