export class DescrizioneTurno {
    constructor(
        /**
         * codice turno
         */
        public codice: string,
        /**
         * descrizione turno
         */
        public descrizione: string,
        /**
         * indica se diurno o notturno
         */
        public diurnoNotturno: string,
        /**
         * data e ora inizio turno,
         */
        public dataOraInizio: string, // Todo: mettere Date
        /**
         * data e ora fine turno
         */
        public dataOraFine: string, // Todo: mettere Date
    ) {
    }
}
