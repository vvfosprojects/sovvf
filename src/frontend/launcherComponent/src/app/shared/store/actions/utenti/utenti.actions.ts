import { Utente } from '../../../model/utente.model';

export class GetUtenti {
    static readonly type = '[Utenti] Get lista utenti';
}

export class SetUtenti {
    static readonly type = '[Utenti] Set lista utenti';

    constructor(public utenti: Utente[]) {
    }
}
