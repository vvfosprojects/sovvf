
export class DurataPermesso {
    constructor(

        /**
         * Data iniziale per cui vale il permesso. Può essere null per indicare validità indefinita.
         */
        public dataInizioPermesso: Date,

        /**
         * Data Finale per cui vale il permesso. Può essere null per indicare validità indefinita.
         */
        public dataFinePermesso: Date) { }
}