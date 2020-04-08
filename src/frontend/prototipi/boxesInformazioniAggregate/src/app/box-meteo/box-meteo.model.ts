export class MeteoSo {
    constructor(
        /**
        * E' la descrizione dello stato del meteo
        */
        public descStato: string,

        /**
         * E' la temperatura
         */
        public temperatura: number,

        /**
        * E' la percentuale di Umidità
        */
        public umidita: number,

        /**
         * E' la percentuale di probabilità di precipitazione
         */
        public probPrecipitazione: number,

        /**
       * E' la percentuale di probabilità di precipitazione
       */
        public prevNeve: string

    ) { }
}