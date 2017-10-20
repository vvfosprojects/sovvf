import {InfoMezzo } from "./info-mezzo.model";
import { FunzionariSo } from "app/info-aggregate/funzionari-so.model";

export class InfoAggragate {
    constructor(
        /**
         * E' il numero delle chiamate in corso non ancora evase
         */
        public numChiamate: number,
        /**
         * E' il numero degli Interventi aperti
         */
        public numIntAperti: number,

        /*** E' il numero degli Interventi Aperti Non Presidiati
        */
        public numIntNonPresidiati: number,
        
        /*** E' il numero degli Interventi Aperti Presidiati
        */
        public numIntPresidiati: number,
        
         /*** E' il numero degli Interventi Aperti Sospesi
        */
        public numIntSospesi: number,
        
        /**
         * Array contenente per ogni genere mezzo da visualizzare, il numero totale dei mezzi per ogni stato 
         */
        public infoMezzo: InfoMezzo[],

          /**
         * E' il totale delle squadre in Sede
         */
        public squadreInSede: number,
        
        /**
         * E' il totale delle squadre in Viaggio
         */
        public squadreInViaggio: number,

        /**
         * E' il totale delle squadre Sul Posto
         */
        public squadreSulPosto: number,

        /**
         * E' il totale delle squadre In Rientro
         */
        public squadreInRientro: number,

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
         * Array contenente le informazioni relative ai funzionari di servizio in Sala Operativa
         */
        public funzionariSo: FunzionariSo[]

        ) { }
}