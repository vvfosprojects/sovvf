export class Evento {
    constructor(
        /**
         * istante in cui viene generato l'evento
         */
        public istante: Date,
        /**
         * identificativo univoco della fonte informativa sull'evento
         */
        public codiceFonte: string,
        /**
         * codice della richiesta a cui l'evento appartiene
         */
        public codiceRichiesta: string,
        /**
         * è la data in cui viene registrato l'evento
         */
        public istanteCreazione: Date
    ) {
    }
}