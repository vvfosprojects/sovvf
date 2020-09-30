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
         * codice fiscale utente
         */
        public codiceFiscale: string,
        /**
         * sede di appartenzenza dell'utente
         */
        public sede: Sede,
        /**
         * username dell'utente
         */
        public username: string,
        /**
         * password dell'utente
         */
        public password?: string,
        /**
         * ruoli utente
         */
        public ruoli?: Ruolo[],
        /**
         * json web token dell'utente
         */
        public token?: string,
        /**
         * validoDa validità accesso utente
         */
        public validoDa?: Date,
        /**
         * validoFinoA validità accesso utente
         */
        public validoFinoA?: Date,
        /**
         * attivo verifica se l'utente è abilitato
         */
        public attivo?: boolean,
        /**
         * qualifica dell'utente
         */
        public qualifica?: string,
    ) {
    }
}

export interface Ruolo {
    descrizione: Role | string;
    codSede: string;
    descSede?: string;
    ricorsivo?: boolean;
    hidden?: boolean;
}

export enum Role {
    Visualizzatore = 'Visualizzatore',
    Amministratore = 'Amministratore',
    GestoreChiamate = 'Gestore Chiamate',
    GestoreRichieste = 'Gestore Richieste'
}

// export enum Role {
//     Operator = 'Operatore',
//     Administrator = 'Amministratore'
// }
