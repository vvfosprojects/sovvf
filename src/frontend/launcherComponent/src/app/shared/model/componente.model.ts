/**
 * Modella il generico componente della squadra
 */
import { Qualifica } from '../interface/squadra-composizione-interface';

export class Componente {
    constructor(
        /**
         * La qualifica
         */
        public descrizioneQualifica: string,
        /**
         * Il nominativo esteso del componente
         */
        public nominativo: string,
        /**
         * Indicazione del ruolo di capopartenza
         */
        public capoPartenza: boolean,
        /**
         * Indicazione del ruolo di autista
         */
        public autista: boolean,
        /**
         * Indicazione del ruolo di rimpiazzo
         */
        public rimpiazzo: boolean,
        /**
         * Codice Fiscale del componente
         */
        public codiceFiscale?: string,
        /**
         * Il tooltip, utile specialmente per sanare problemi di omonimia
         */
        public tooltip?: string,
        /**
         * Funzioni del componenete
         */
        public qualifications?: Qualifica[],
    ) {
    }
}
