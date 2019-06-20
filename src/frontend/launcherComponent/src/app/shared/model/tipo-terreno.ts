import { TipoTerrenoEnum } from '../enum/tipo-terreno.enum';

export class TipoTerreno {
    constructor(
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
