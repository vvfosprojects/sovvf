import {Sede} from './sede.model';

export class Operatore {
    constructor(
        /**
         * username dell'operatore
         */
        public username: string,
        /**
         * nome operatore
         */
        public nome: string,
        /**
         * cognome operatore
         */
        public cognome: string,
        /**
         * codice fiscale operatore
         */
        public codiceFiscale: string,
        /**
         * inizio validità accesso operatore
         */
        public validoDa?: Date,
        /**
         * fine validità accesso operatore
         */
        public validoFinoA?: Date,
        /**
         * verifica se l'operatore è abilitato
         */
        public attivo?: boolean,
        /**
         * la password dell'operatore
         */
        public password?: string,
        /**
         * il tipo di operatore
         */
        public tipo?: string,
        /**
         * la sede di appartenzenza dell'operatore
         */
        public sede?: Sede
    ) { }
}
