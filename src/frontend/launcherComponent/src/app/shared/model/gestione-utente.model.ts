import { Role, Utente } from './utente.model';
import { Sede } from './sede.model';

export class GestioneUtente {
    constructor(
        /**
         * id utente
         */
        public id_utente: string,
        /**
         * nome
         */
        public nome: string,
        /**
         * cognome
         */
        public cognome: string,
        /**
         * ruolo utente
         */
        public ruolo: Role,
        /**
         * sede relativa al ruolo utente
         */
        public sede: Sede
    ) {
    }
}
