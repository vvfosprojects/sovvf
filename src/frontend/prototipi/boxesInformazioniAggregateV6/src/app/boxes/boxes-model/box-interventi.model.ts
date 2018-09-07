export class BoxInterventi {
    constructor(
        /* Interventi con mezzi non ancora arrivati sul posto */
        public chiamate: number,
        /* Interventi con mezzi sul posto */
        public assegnati: number,
        /* Interventi con mezzi in rientro  */
        public presidiati: number,
        /* Interventi con mezzi in attesa  */
        public sospesi: number
        ) { }
}
