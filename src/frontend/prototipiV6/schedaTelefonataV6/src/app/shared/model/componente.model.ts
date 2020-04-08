/**
 * Modella il generico componente della squadra
 */
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
         * Il tooltip, utile specialmente per sanare problemi di omonimia
         */
        public tooltip: string,
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
        public rimpiazzo: boolean
    ) {
    }
}
