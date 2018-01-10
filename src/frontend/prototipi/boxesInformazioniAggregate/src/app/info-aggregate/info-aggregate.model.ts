import {InfoMezzo } from "../box-mezzi/info-mezzo.model";
import { FunzionariSo } from "app/box-funzionari/funzionari-so.model";
import { InterventiSo } from "app/box-interventi/box-interventi.model";
import { SquadreSo } from "app/box-squadre/box-squadre.model";
import { MeteoSo } from "app/box-meteo/box-meteo.model";

 export class InfoAggregate {
     constructor(
         /**
         * Informazioni relative alle Chiamate ed interventi 
         */
         public interventi: InterventiSo,
                /**
         * Array contenente per ogni genere mezzo da visualizzare, il numero totale dei mezzi per ogni stato 
         */
         public infoMezzo: InfoMezzo[],
        /**
         * Informazioni relative al numero delle squadre per ciascun Stato
         */
         public squadre: SquadreSo,
        /**
         * Array contenente le informazioni relative al meteo
         */
         public meteo: MeteoSo,
         /**
         * Array contenente le informazioni relative ai funzionari di servizio in Sala Operativa
         */
         public funzionariSo: FunzionariSo[]

         ) { }
 }


                
