export class BoxInterventi {
    constructor(
        /**
         * Interventi con mezzi non ancora arrivati sul posto
         */
        public chiamate: number,
        /**
         * Interventi con mezzi sul posto
         */
        public assegnati: number,
        /**
         * Interventi con mezzi in rientro
         */
        public presidiati: number,
        /**
         * Interventi con mezzi in attesa
         */
        public sospesi: number,
        /**
         * totale degli interventi in corso
         */
        public totale: number,
        /**
         * Interventi totali turno corrente
         */
        public totTurnoCorrente: number,
        /**
         * Descrizione turno corrente
         */
        public nomeTurnoCorrente: string,
        /**
         * Interventi totali turno precedente
         */
        public totTurnoPrecedente: number,
        /**
         * Descrizione turno precedente
         */
        public nomeTurnoPrecedente: string,
        /**
         * descrizione anno corrente
         */
        public annoCorrente: number,
        /**
         * Interventi totali dell'anno corrente
         */
        public totAnnoCorrente: number
    ) {
    }

}
