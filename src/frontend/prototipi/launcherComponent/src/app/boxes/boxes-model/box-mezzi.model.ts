export class BoxMezzi {
    constructor(
        /* Totale interventi aperti */
        public inServizio: number,
        
        /* Chiamate non ancora presidiate */
        public inSede: number,

        /* Interventi con mezzi non ancora arrivati sul posto */
        public inViaggio: number,

        /* Interventi con mezzi sul posto */
        public sulPosto: number,

        /* Interventi con mezzi in rientro  */
        public inRientro: number
        ) { }
}