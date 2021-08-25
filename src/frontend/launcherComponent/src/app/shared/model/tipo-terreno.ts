import { TipoTerrenoEnum } from '../enum/tipo-terreno.enum';

export class TipoTerreno {
    constructor(
        /**
         * descrizione del tipo di terreno
         */
        public descrizione: TipoTerrenoEnum,
        /**
         * ha del tipo di terreno
         */
        public ha: number,
    ) {

    }
}
