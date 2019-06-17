import { TipoTerrenoEnum } from '../enum/tipo-terreno.enum';

export class TipoTerreno {
    constructor(
        /**
         * codice del tipo di terreno
         */
        public codice: string,
        /**
         * descrizione del tipo di terreno
         */
        public descrizione: TipoTerrenoEnum,
        /**
         * mq del tipo di terreno
         */
        public mq: number,
    ) {

    }
}
