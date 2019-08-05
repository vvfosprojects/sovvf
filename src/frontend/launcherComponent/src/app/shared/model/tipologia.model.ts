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
         * categoria
         */
        public categoria?: string,
        /**
         * star preferito
         */
        public star?: boolean,
        /**
         * tipoLuogoEvento
         */
        public tipoLuogoEvento?: TipoLuogoEvento,
        /**
         * codiceDescrizione
         */
        public codiceDescrizione?: string,
        /**
         * flag per i campi campi / boschi / strepaglie
         */
        public boschivo?: boolean
    ) {
    }
}
