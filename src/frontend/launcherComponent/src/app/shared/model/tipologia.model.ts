/**
 * Modella una tipologia di intervento
 */
import { TipoLuogoEvento } from './tipo-luogo-evento';

export class Tipologia {
    constructor(
        /**
         * codice tipologia
         */
        public codice: string,
        /**
         * descrizione della tipologia
         */
        public descrizione: string,
        /**
         * icona font-awesome
         */
        public icona?: string,
        /**
         *
         */
        public categoria?: string,
        /**
         *
         */
        public star?: boolean,
        /**
         *
         */
        public tipoLuogoEvento?: TipoLuogoEvento
    ) {
    }
}
