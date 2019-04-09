import { Sede } from './sede.model';

export class Utente {
    constructor(
        /**
         * id dell'utente
         */
        public id: string,
        /**
         * nome utente
         */
        public nome: string,
        /**
         * cognome utente
         */
        public cognome: string,
        /**
         * username dell'utente
         */
        public username?: string,
        /**
         * password dell'utente
         */
        public password?: string,
        /**
         * ruolo utente
         */
        public ruolo?: Ruolo[],
        /**
         * la sede di appartenzenza dell'utente
         */
        public sede?: Sede,
        /**
         * funzionalità associate all'utente
         */
        // public privilegi?: Features[],
        /**
         * json web token dell'utente
         */
        public token?: string,
        /**
         * codice fiscale utente
         */
        public codiceFiscale?: string,
        /**
         * inizio validità accesso utente
         */
        public validoDa?: Date,
        /**
         * fine validità accesso utente
         */
        public validoFinoA?: Date,
        /**
         * verifica se l'utente è abilitato
         */
        public attivo?: boolean,
        /**
         * la qualifica dell'utente
         */
        public qualifica?: string,
    ) {
    }
}

export interface Ruolo {
    descrizione: Role;
    sede: Sede;
}

export enum Role {
    User,
    Admin
}
