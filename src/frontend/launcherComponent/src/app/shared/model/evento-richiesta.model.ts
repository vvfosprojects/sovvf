import { Utente } from './utente.model';

export class EventoRichiesta {
    constructor(
        public id: string,
        public nomeClasseEvento: string,
        public istanteEvento: Date,
        public targa: string,
        public note: string,
        public idOperatore?: string,
        public operatore?: Utente
    ) {
    }

}

